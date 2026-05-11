import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface InfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface InfoCardProps {
  title?: string;
  items: InfoItem[];
}

const InfoCard = ({ title, items }: InfoCardProps) => (
  <View
    className="bg-white/80 mb-6 px-5 py-5 rounded-3xl border border-white/20 shadow-sm"
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
    }}
  >
    {title ? (
      <Text className="text-base font-bold text-slate-900 mb-5 tracking-tight">
        {title}
      </Text>
    ) : null}
    <View className="gap-y-5">
      {items.map((item, idx) => (
        <View key={idx} className="flex-row items-start">
          <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center mr-3 border border-pink-100">
            {item.icon}
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              {item.label}
            </Text>
            <Text className="text-base font-semibold text-slate-800">
              {item.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

interface GuestDetailsInfoProps {
  guest: any;
  isOrganizer?: boolean;
  isConfirmed?: boolean;
  onDeleteGuest?: () => void;
  onEditRoom?: () => void;
  onEditMeal?: () => void;
  onEditContact?: () => void;
}

export default function GuestDetailsInfo({
  guest,
  isOrganizer = false,
  isConfirmed = false,
  onDeleteGuest,
  onEditRoom,
  onEditMeal,
  onEditContact,
}: GuestDetailsInfoProps) {
  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    return `$${amount.toLocaleString()}`;
  };

  if (!guest) return null;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Premium Header */}
      <LinearGradient
        colors={["rgba(238,43,140,0.07)", "transparent"]}
        className="items-center px-6 pt-10 pb-8 rounded-b-[40px]"
      >
        {isOrganizer && !isConfirmed && onDeleteGuest && (
          <TouchableOpacity
            onPress={onDeleteGuest}
            className="absolute right-6 top-4 p-3 rounded-full bg-white shadow-sm"
            activeOpacity={0.8}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}

        <View className="relative mb-4">
          <View className="absolute -inset-2 bg-pink-100/50 rounded-full blur-2xl" />
          {guest.avatar ? (
            <Image
              source={{ uri: guest.avatar }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-pink-600 border-4 border-white items-center justify-center shadow-xl">
              <Text className="text-white text-4xl font-bold">
                {getInitials(guest.name)}
              </Text>
            </View>
          )}
          <View className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${isConfirmed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </View>

        <Text className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight text-center">
          {guest.name}
        </Text>
        <Text className="text-pink-600 font-bold text-sm mb-4 uppercase tracking-[2px]">
          {isConfirmed ? "Confirmed" : "RSVP Pending"} • {guest.relation || "Guest"}
        </Text>

        {(guest.arrivalDate || guest.departureDate) && (
          <View className="flex-row items-center justify-center bg-white/60 px-4 py-2 rounded-full border border-pink-50">
            <Ionicons name="calendar-outline" size={14} color="#ee2b8c" />
            <Text className="text-slate-600 text-[12px] font-semibold ml-2">
              {formatDate(guest.arrivalDate)} — {formatDate(guest.departureDate)}
            </Text>
          </View>
        )}
      </LinearGradient>

      <View className="px-5 mt-2 pb-10">
        {/* Contact Info */}
        <View className="relative">
          <InfoCard
            title="Contact Information"
            items={[
              {
                label: "Phone Number",
                value: guest.phone || "Not provided",
                icon: <Ionicons name="call-outline" size={18} color="#ee2b8c" />,
              },
              {
                label: "Email Address",
                value: guest.email || "Not provided",
                icon: <Ionicons name="mail-outline" size={18} color="#ee2b8c" />,
              },
            ]}
          />
          {isOrganizer && onEditContact && (
            <TouchableOpacity 
              className="absolute top-5 right-5"
              onPress={onEditContact}
            >
              <Ionicons name="create-outline" size={18} color="#ee2b8c" />
            </TouchableOpacity>
          )}
        </View>

        {/* RSVP Details */}
        <View className="relative">
          <InfoCard
            title="RSVP & Preferences"
            items={[
              {
                label: "Total Group Size",
                value: String(guest.totalGuests || 1),
                icon: <Ionicons name="people-outline" size={18} color="#ee2b8c" />,
              },
              {
                label: "Meal / Dietary",
                value: guest.mealPreference || "Not specified",
                icon: <Ionicons name="restaurant-outline" size={18} color="#ee2b8c" />,
              },
              {
                label: "Guest Category",
                value: guest.category || guest.relation || "Standard",
                icon: <Ionicons name="ribbon-outline" size={18} color="#ee2b8c" />,
              },
            ]}
          />
          {isOrganizer && onEditMeal && (
            <TouchableOpacity 
              className="absolute top-5 right-5"
              onPress={onEditMeal}
            >
              <Ionicons name="create-outline" size={18} color="#ee2b8c" />
            </TouchableOpacity>
          )}
        </View>

        {/* Travel & Stay */}
        <View className="relative">
          <InfoCard
            title="Travel & Accommodation"
            items={[
              {
                label: "Arrival Location",
                value: `${formatDate(guest.arrivalDate)} @ ${formatTime(guest.arrivalDate)}\n${guest.arrivalLocation || ""}`,
                icon: <Ionicons name="airplane-outline" size={18} color="#ee2b8c" />,
              },
              {
                label: "Departure Location",
                value: `${formatDate(guest.departureDate)} @ ${formatTime(guest.departureDate)}\n${guest.departureLocation || ""}`,
                icon: <Ionicons name="airplane-outline" size={18} color="#ee2b8c" />,
              },
              {
                label: "Room Allocation",
                value: guest.roomAllocation || "Not assigned yet",
                icon: <Ionicons name="bed-outline" size={18} color="#ee2b8c" />,
              },
            ]}
          />
          {isOrganizer && onEditRoom && (
            <TouchableOpacity 
              className="absolute top-5 right-5"
              onPress={onEditRoom}
            >
              <Ionicons name="create-outline" size={18} color="#ee2b8c" />
            </TouchableOpacity>
          )}
        </View>

        {/* Gifts & Notes */}
        <InfoCard
          title="Gifts & Notes"
          items={[
            {
              label: "Gift Information",
              value: guest.giftAmount 
                ? `${formatCurrency(guest.giftAmount)} - ${guest.giftStatus || "Received"}`
                : "No gift info",
              icon: <Ionicons name="gift-outline" size={18} color="#ee2b8c" />,
            },
            {
              label: "Internal Notes",
              value: guest.notes || "No notes",
              icon: <Ionicons name="document-text-outline" size={18} color="#ee2b8c" />,
            },
          ]}
        />
      </View>
    </ScrollView>
  );
}
