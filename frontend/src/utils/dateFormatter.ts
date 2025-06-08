import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// UTCの日時文字列を日本のタイムゾーン 'yyyy/MM/dd HH:mm' 形式に変換する
export const formatToJST = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  const timeZone = "Asia/Tokyo"; // 日本のタイムゾーン

  try {
    const zonedDate = toZonedTime(dateInput, timeZone);
    return format(zonedDate, "yyyy/MM/dd HH:mm");
  } catch (error) {
    console.error("Failed to format date: ", error);
    return "Invalid Date";
  }
};
