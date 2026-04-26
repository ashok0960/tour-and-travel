from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from .models import SupportTicket
from .serializers import SupportTicketSerializer


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'vendor'


class CreateTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()
        recipient_role = request.data.get('recipient_role', 'admin')

        if not subject or not message:
            return Response({'error': 'Subject and message are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if recipient_role not in ('vendor', 'admin'):
            return Response({'error': 'Invalid recipient.'}, status=status.HTTP_400_BAD_REQUEST)

        sender_role = request.user.role if request.user.role in ('user', 'vendor') else 'user'

        if sender_role == 'vendor':
            recipient_role = 'admin'

        ticket = SupportTicket.objects.create(
            sender=request.user,
            subject=subject,
            message=message,
            sender_role=sender_role,
            recipient_role=recipient_role,
        )
        return Response(SupportTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


class MyTicketsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        return SupportTicket.objects.filter(sender=self.request.user)


class AllTicketsView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        qs = SupportTicket.objects.filter(recipient_role='admin')
        if role in ('user', 'vendor'):
            qs = qs.filter(sender_role=role)
        return qs


class VendorTicketsView(generics.ListAPIView):
    permission_classes = [IsVendor]
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        return SupportTicket.objects.filter(recipient_role='vendor')


class RespondTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
        except SupportTicket.DoesNotExist:
            return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

        if ticket.recipient_role == 'admin' and request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        if ticket.recipient_role == 'vendor' and request.user.role != 'vendor':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        ticket.response = request.data.get('response', ticket.response)
        ticket.status = request.data.get('status', ticket.status)
        ticket.save()
        return Response(SupportTicketSerializer(ticket).data)


class DeleteTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
        except SupportTicket.DoesNotExist:
            return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

        if ticket.sender != request.user and request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
