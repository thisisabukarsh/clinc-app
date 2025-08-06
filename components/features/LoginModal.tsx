"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const success = await login(email, password);
      if (success) {
        onClose();
        setEmail("");
        setPassword("");
        setErrors({});
      } else {
        setErrors({ general: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }
    } catch (error) {
      setErrors({
        general: "حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const handleClose = () => {
    onClose();
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تسجيل الدخول" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">بيانات تجريبية:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>البريد:</strong> patient@example.com
            </p>
            <p>
              <strong>كلمة المرور:</strong> password
            </p>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <Input
          type={showPassword ? "text" : "password"}
          label="كلمة المرور"
          placeholder="أدخل كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
