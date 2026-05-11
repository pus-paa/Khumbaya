import { Text } from "@/src/components/ui/Text";
import { useEventById } from "@/src/features/events/hooks/use-event";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#ee2b8c";

const fmt = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const fmtTime = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const Row = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string | null;
}) => (
  <View className="flex-row items-center gap-3 py-3.5">
    <View className="w-9 h-9 rounded-full bg-pink-50 items-center justify-center">
      <MaterialIcons name={icon as any} size={18} color={PRIMARY} />
    </View>
    <View className="flex-1">
      <Text className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </Text>
      <Text className="text-sm font-semibold text-gray-800">{value}</Text>
      {sub ? <Text className="text-xs text-gray-500 mt-0.5">{sub}</Text> : null}
    </View>
  </View>
);

const Sep = () => <View className="h-px bg-gray-100" />;

const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="mx-4 mt-3 bg-white rounded-2xl px-4 border border-gray-100 shadow-sm overflow-hidden">
    {children}
  </View>
);

export default function SubEventDetailScreen() {
  const router = useRouter();
  const { subEventId } = useLocalSearchParams<{ subEventId: string }>();
  const parsedId = Number(subEventId);

  const { data: subEvent, isLoading } = useEventById(parsedId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!subEvent) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-gray-700">Event not found</Text>
      </SafeAreaView>
    );
  }

  const {
    title,
    status,
    imageUrl,
    startDateTime,
    endDateTime,
    location,
    venue,
    theme,
    role,
    budget,
    description,
    dressCode,
    rsvpDeadline,
  } = subEvent;

  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Upcoming";

  const startDate = fmt(startDateTime);
  const startTime = fmtTime(startDateTime);
  const endDate = fmt(endDateTime);
  const endTime = fmtTime(endDateTime);
  const rsvpDate = fmt(rsvpDeadline);
  const rsvpTime = fmtTime(rsvpDeadline);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>

      <View className="w-full h-80">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-pink-100 items-center justify-center">
            <Ionicons name="image-outline" size={56} color="#f9a8d4" />
          </View>
        )}
        <View className="absolute inset-0 bg-black/30" />

        {/* Nav buttons */}
        <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-white items-center justify-center shadow"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#181114" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/(protected)/(client-stack)/events/${parsedId}/(organizer)/edit-event`
              )
            }
            className="w-9 h-9 rounded-full bg-white items-center justify-center shadow"
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Title + status */}
        <View className="absolute bottom-6 left-0 right-0 items-center px-6">
          <Text className="text-white text-3xl font-bold mb-2 text-center">
            {title || "Sub Event"}
          </Text>
          <View className="bg-[#ee2b8c] px-4 py-1 rounded-full">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Card>
          <Row icon="event" label="Start" value={startDate ?? ""} sub={startTime} />
          <Sep />
          <Row icon="event-available" label="End" value={endDate ?? ""} sub={endTime} />
          {rsvpDeadline ? (
            <>
              <Sep />
              <Row icon="schedule" label="RSVP Deadline" value={rsvpDate ?? ""} sub={rsvpTime} />
            </>
          ) : null}
          <Sep />
          <Row icon="location-on" label="Venue" value={location || venue || ""} />
          {theme || dressCode || role ? <Sep /> : null}
          {theme ? <Row icon="palette" label="Theme" value={theme} /> : null}
          {dressCode ? (
            <>
              {theme ? <Sep /> : null}
              <Row icon="checkroom" label="Dress Code" value={dressCode} />
            </>
          ) : null}
          {role ? (
            <>
              {theme || dressCode ? <Sep /> : null}
              <Row icon="person" label="Your Role" value={role} />
            </>
          ) : null}
        </Card>

        {/* Budget */}
        {budget && budget > 0 ? (
          <View className="mx-4 mt-3 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-pink-50 items-center justify-center">
                <MaterialIcons name="account-balance-wallet" size={18} color={PRIMARY} />
              </View>
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Budget
              </Text>
            </View>
            <Text className="text-lg font-bold text-[#ee2b8c]">
              ₹{Number(budget).toLocaleString()}
            </Text>
          </View>
        ) : null}

        {/* Description */}
        {description ? (
          <View className="mx-4 mt-3 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="description" size={16} color={PRIMARY} />
              <Text className="text-sm font-bold text-gray-700">Description</Text>
            </View>
            <Text className="text-sm text-gray-500 leading-relaxed">{description}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
