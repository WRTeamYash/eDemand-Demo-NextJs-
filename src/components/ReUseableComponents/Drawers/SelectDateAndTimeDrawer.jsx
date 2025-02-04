"use client";
import { useEffect, useState } from "react";
import {
  changeOrderStatusApi,
  checkSlotsApi,
  getAvailableSlotApi,
} from "@/api/apiRoutes";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils"; // Assuming you have this utility function
import dayjs from "dayjs";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setDilveryDetails } from "@/redux/reducers/cartSlice";
import CustomTimePicker from "./CustomTimePicker";
import { useRouter } from "next/router";
import { useTranslation } from "@/components/Layout/TranslationContext";
import { selectReorderMode } from "@/redux/reducers/reorderSlice";

const SelectDateAndTimeDrawer = ({
  dilveryDetails,
  providerId,
  open,
  onClose,
  isRechedule,
  orderID,
  customJobId,
}) => {
  const t = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  // Get reorder state
  const isReorderMode = useSelector(selectReorderMode);
  const reorderState = useSelector((state) => state.reorder);

  const [selectedDate, setSelectedDate] = useState(
    dilveryDetails?.dilveryDate
      ? dayjs(dilveryDetails?.dilveryDate) // Ensure it's a dayjs object
      : dayjs() // Default to today's date
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    dilveryDetails?.dilveryDate ? dilveryDetails?.dilveryTime : null
  );
  const [customTime, setCustomTime] = useState(null);
  const [timeSlots, setTimeSlotes] = useState([]);
  // Set the default selected date when the component mounts (optional)
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(dayjs()); // Set to today's date if not already set
    }
  }, []);

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCustomTime(timeSlot);
  };

  useEffect(() => {
    if (customTime) {
      setSelectedTimeSlot(customTime);
    }
  }, [customTime]);

  const fetchTimeSlots = async () => {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    try {
      const response = await getAvailableSlotApi({
        partner_id: providerId,
        selectedDate: formattedDate,
        custom_job_request_id: customJobId ? customJobId : "",
      });
      if (response?.error === false) {
        setTimeSlotes(response?.data?.all_slots);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const handleClose = () => {
    onClose();
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const changeOrderStatus = async () => {
    try {
      const response = await changeOrderStatusApi({
        order_id: orderID,
        status: "rescheduled",
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        time: selectedTimeSlot,
      });
      if (response?.error === false) {
        toast.success(response?.message);
        onClose();
        router.push(`/booking/${orderID}`);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate && !selectedTimeSlot) {
      toast.error(t("pleaseSelectDateAndTimeSlot"));
    } else if (!selectedDate) {
      toast.error(t("pleaseSelectDate"));
    } else if (!selectedTimeSlot) {
      toast.error(t("pleaseSelectTimeSlot"));
    } else {
      try {
        const response = await checkSlotsApi({
          partner_id: providerId,
          date: dayjs(selectedDate).format("YYYY-MM-DD"),
          time: selectedTimeSlot,
          custom_job_request_id: customJobId ? customJobId : "",
          order_id: isReorderMode ? reorderState.orderId : "",
        });
        if (response?.error === false) {
          if (!isRechedule) {
            dispatch(
              setDilveryDetails({
                ...dilveryDetails, // Keep the existing delivery details
                dilveryDate: selectedDate,
                dilveryTime: selectedTimeSlot,
              })
            );
            onClose(); // Close the drawer if both date and time are selected
          } else {
            changeOrderStatus();
          }
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        console.error("Error setting delivery details:", error);
      }
    }
  };

  return (
    <Drawer open={open} onClose={handleClose} closeOnClickOutside={false}>
      <DrawerContent
        className={cn(
          "max-w-full lg:max-w-7xl mx-auto rounded-tr-[18px]",
          "max-h-full lg:max-h-fit overflow-y-auto lg:overflow-hidden [&_::-webkit-calendar-picker-indicator]:z-[60]"
        )}
      >
        <DrawerTitle className="hidden">{t("scheduleAppointment")}</DrawerTitle>
        <div className="select_date flex flex-col lg:flex-row gap-8 py-4 lg:py-16 px-4 lg:px-12 overflow-y-auto h-fit max-h-fit">
          {/* Left side: Calendar */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">{t("schedule")}</h2>
            <div className="schedule_cal w-full border rounded-2xl p-3">
              <Calendar
                mode="single"
                selected={selectedDate.toDate()} // Convert dayjs object to Date for the Calendar
                onSelect={(date) => setSelectedDate(dayjs(date))} // Use dayjs to set selectedDate
                showOutsideDays={true}
                disabled={{ before: new Date() }}
              />
            </div>
          </div>

          {/* Right side: Time Slots */}
          <div className="w-full">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">
                {t("selectTimeSlot")}{" "}
              </h2>
              <div className="flex flex-col gap-6">
                {timeSlots.length > 0 ? (
                  <>
                    <div className="time_slots grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-2">
                      {timeSlots?.map((timeSlot) => (
                        <button
                          key={timeSlot.time}
                          className={cn(
                            "px-4 py-3 flex flex-col gap-2 rounded-lg border card_bg",
                            selectedTimeSlot === timeSlot.time
                              ? "primary_text_color border_color selected_shadow"
                              : "description_color",
                            timeSlot.is_available === 0 &&
                              "opacity-50 cursor-not-allowed !background_color"
                          )}
                          onClick={() =>
                            timeSlot.is_available === 1 &&
                            handleTimeSlotSelect(timeSlot.time)
                          }
                          disabled={timeSlot.is_available === 0}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-base font-normal">
                              {dayjs(
                                new Date(`1970-01-01T${timeSlot.time}`)
                              ).format("h:mm A")}
                            </span>
                            {selectedTimeSlot === timeSlot.time && (
                              <span className="primary_text_color">
                                <FaCheck />
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 flex items-center justify-between w-full light_bg_color border_color primary_text_color rounded-lg">
                      <CustomTimePicker
                        value={customTime}
                        setSelectedTimeSlot={setSelectedTimeSlot}
                        onChange={(time) => {
                          const formattedTime = dayjs(time).format("HH:mm-00"); // Format time to 24-hour format
                          setCustomTime(time);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                <div className="continue flex items-center">
                  <button
                    className="primary_bg_color text-white rounded-lg p-3 w-full"
                    onClick={handleSchedule}
                  >
                    {t("continue")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectDateAndTimeDrawer;
