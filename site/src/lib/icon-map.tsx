import {
  Smartphone, MapPin, ShieldCheck, Zap, Wallet, Headphones, Star,
  Car, CheckCircle2, Clock, CreditCard, Users, Sparkles, Heart,
  TrendingUp, BellRing, UserCheck, PhoneCall, Lock, Eye,
  AlertTriangle, HeartPulse, MessageCircle, Mail, ArrowRight, Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Smartphone, MapPin, ShieldCheck, Zap, Wallet, Headphones, Star,
  Car, CheckCircle2, Clock, CreditCard, Users, Sparkles, Heart,
  TrendingUp, BellRing, UserCheck, PhoneCall, Lock, Eye,
  AlertTriangle, HeartPulse, MessageCircle, Mail, ArrowRight, Info,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] || Star;
}
