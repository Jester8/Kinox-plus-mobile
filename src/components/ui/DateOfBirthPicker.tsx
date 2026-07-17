import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import Button from "./Button";

type DateOfBirthPickerProps = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  minAge?: number;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type Mode = "days" | "months" | "years";

export default function DateOfBirthPicker({
  visible,
  value,
  onClose,
  onConfirm,
  minAge = 13,
}: DateOfBirthPickerProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const maxDate = useMemo(() => new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate()), []);
  const [cursor, setCursor] = useState(value ?? maxDate);
  const [selected, setSelected] = useState<Date | null>(value);
  const [mode, setMode] = useState<Mode>("days");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxDate.getFullYear(); y >= maxDate.getFullYear() - 100; y--) list.push(y);
    return list;
  }, [maxDate]);

  const dayCells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const total = daysInMonth(year, month);
    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [year, month]);

  const goMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    if (next <= maxDate) setCursor(next);
  };

  const canGoNextMonth = new Date(year, month + 1, 1) <= maxDate;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View
          className="gap-5 rounded-t-3xl border border-line/10 bg-navy-950 p-6"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Date of birth</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color={colors.blue300} />
            </Pressable>
          </View>

          {mode === "days" && (
            <>
              <View className="flex-row items-center justify-between">
                <Pressable onPress={() => goMonth(-1)} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full bg-elevated/5">
                  <ChevronLeft size={18} color={colors.blue300} />
                </Pressable>
                <View className="flex-row gap-2">
                  <Pressable onPress={() => setMode("months")}>
                    <Text className="text-base font-['Manrope_600SemiBold'] text-foreground">{MONTH_NAMES[month]}</Text>
                  </Pressable>
                  <Pressable onPress={() => setMode("years")}>
                    <Text className="text-base font-['Manrope_600SemiBold'] text-blue-300">{year}</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => canGoNextMonth && goMonth(1)}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-full bg-elevated/5"
                  disabled={!canGoNextMonth}
                >
                  <ChevronRight size={18} color={canGoNextMonth ? colors.blue300 : colors.foreground + "33"} />
                </Pressable>
              </View>

              <View className="flex-row">
                {WEEKDAY_LABELS.map((w, i) => (
                  <View key={i} className="flex-1 items-center py-1">
                    <Text className="text-xs font-['Manrope_500Medium'] text-blue-100/40">{w}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row flex-wrap">
                {dayCells.map((d, i) => {
                  const date = d ? new Date(year, month, d) : null;
                  const disabled = !date || date > maxDate;
                  const active = date && selected && isSameDay(date, selected);
                  return (
                    <View key={i} style={{ width: `${100 / 7}%` }} className="items-center py-1">
                      {d && (
                        <Pressable
                          disabled={disabled}
                          onPress={() => date && setSelected(date)}
                          className={`h-10 w-10 items-center justify-center rounded-full ${active ? "bg-blue-600" : ""}`}
                        >
                          <Text
                            className={`text-sm ${
                              active ? "font-['Manrope_600SemiBold'] text-white" : disabled ? "text-foreground/15" : "text-foreground/85"
                            }`}
                          >
                            {d}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {mode === "months" && (
            <View className="flex-row flex-wrap">
              {MONTH_NAMES.map((m, i) => {
                const disabled = new Date(year, i, 1) > maxDate && year === maxDate.getFullYear();
                return (
                  <View key={m} style={{ width: "33.33%" }} className="p-1.5">
                    <Pressable
                      disabled={disabled}
                      onPress={() => {
                        setCursor(new Date(year, i, 1));
                        setMode("days");
                      }}
                      className={`items-center rounded-xl py-3 ${i === month ? "bg-blue-500/20" : "bg-elevated/5"}`}
                    >
                      <Text className={`text-sm ${disabled ? "text-foreground/15" : i === month ? "text-blue-200" : "text-foreground/80"}`}>
                        {m.slice(0, 3)}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          {mode === "years" && (
            <FlatList
              data={years}
              keyExtractor={(y) => String(y)}
              style={{ maxHeight: 280 }}
              renderItem={({ item: y }) => (
                <Pressable
                  onPress={() => {
                    setCursor(new Date(y, month, 1));
                    setMode("days");
                  }}
                  className={`items-center rounded-xl py-3 ${y === year ? "bg-blue-500/20" : ""}`}
                >
                  <Text className={`text-base ${y === year ? "font-['Manrope_600SemiBold'] text-blue-200" : "text-foreground/80"}`}>{y}</Text>
                </Pressable>
              )}
            />
          )}

          <Button disabled={!selected} onPress={() => selected && onConfirm(selected)}>
            Confirm
          </Button>
        </View>
      </View>
    </Modal>
  );
}
