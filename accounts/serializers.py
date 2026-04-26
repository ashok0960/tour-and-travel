from rest_framework import serializers
from .models import User
import html
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        value = value.strip()
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError('Username contains invalid characters.')
        return html.escape(value)

    def validate_email(self, value):
        value = value.strip().lower()
        if not value.endswith('@gmail.com'):
            raise serializers.ValidationError('Only @gmail.com email addresses are allowed.')
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters.')
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='user'
        )


class UpdateProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    current_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'current_password')

    def validate_email(self, value):
        value = value.strip().lower()
        if not value.endswith('@gmail.com'):
            raise serializers.ValidationError('Only @gmail.com email addresses are allowed.')
        return value

    def validate(self, data):
        if data.get('password'):
            if not data.get('current_password'):
                raise serializers.ValidationError({'current_password': 'Current password is required to set a new password.'})
            if not self.instance.check_password(data['current_password']):
                raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        return data

    def update(self, instance, validated_data):
        validated_data.pop('current_password', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
