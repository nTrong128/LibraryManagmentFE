<script setup lang="ts">
import { ref, computed, type Ref, watch, type HTMLAttributes } from 'vue';
import {
    CalendarCell,
    CalendarCellTrigger,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHead,
    CalendarGridRow,
    CalendarHeadCell,
    CalendarHeader,
    CalendarHeading,
} from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    type DateValue,
    getLocalTimeZone,
    today,
} from '@internationalized/date';
import { useVModel } from '@vueuse/core';
import {
    CalendarRoot,
    type CalendarRootEmits,
    type CalendarRootProps,
    useDateFormatter,
    useForwardPropsEmits,
} from 'radix-vue';
import { createDecade, createYear, toDate } from 'radix-vue/date';

// Define the props and emits
const props = withDefaults(
    defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>(),
    {
        modelValue: undefined,
        placeholder() {
            return today(getLocalTimeZone());
        },
        weekdayFormat: 'short',
    }
);
const emits = defineEmits<CalendarRootEmits>();

const delegatedProps = computed(() => {
    const { class: _, placeholder: __, ...delegated } = props;
    return delegated;
});

// Placeholder for the selected date
const placeholder = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: today(getLocalTimeZone()),
}) as Ref<DateValue>;

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const formatter = useDateFormatter('en');

// Define reactive properties for selected month, year, and day (complete date)
const selectedMonth = ref(placeholder.value.month); // Initialize with the default value
const selectedYear = ref(placeholder.value.year); // Initialize with the default value
const selectedDay = ref(placeholder.value.day); // Initialize with the default value

const monthNames = {
    1: 'Tháng 1', // January in French
    2: 'Tháng 2', // February
    3: 'Tháng 3', // March
    4: 'Tháng 4', // April
    5: 'Tháng 5', // May
    6: 'Tháng 6', // June
    7: 'Tháng 7', // July
    8: 'Tháng 8', // August
    9: 'Tháng 9', // September
    10: 'Tháng 10', // October
    11: 'Tháng 11', // November
    12: 'Tháng 12', // December
};
const weekdayNames = {
    1: 'Thứ 2', // Monday
    2: 'Thứ 3', // Tuesday
    3: 'Thứ 4', // Wednesday
    4: 'Thứ 5', // Thursday
    5: 'Thứ 6', // Friday
    6: 'Thứ 7', // Saturday
    7: 'CN', // Sunday
};

// Create a reactive variable for the complete selected date
const selectedDate = computed(() => ({
    day: selectedDay.value,
    month: selectedMonth.value,
    year: selectedYear.value,
}));

// Watch for changes in the placeholder and update selected day, month, and year
watch(placeholder, (newValue) => {
    selectedMonth.value = newValue.month;
    selectedYear.value = newValue.year;
    selectedDay.value = newValue.day;

    const date = {
        day: selectedDay.value,
        month: selectedMonth.value,
        year: selectedYear.value,
    };

    console.log(date);
});

// Now you can use selectedDate.value to get the full date
</script>

<template>
    <CalendarRoot v-slot="{ date, grid, weekDays }" v-model:placeholder="placeholder" v-bind="forwarded" :class="cn('rounded-md border p-3', props.class)">
        <CalendarHeader>
            <CalendarHeading class="flex w-full items-center justify-between gap-2">
                <Select :default-value="placeholder.month.toString()" @update:model-value="(v: any) => {
                    if (!v || !placeholder) return;
                    if (Number(v) === placeholder?.month) return;
                    placeholder = placeholder.set({
                        month: Number(v),
                    });
                }
                    ">
                    <SelectTrigger aria-label="Select month" class="w-[60%]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent class="max-h-[200px]">
                        <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()" :value="month.month.toString()">
                            <!-- {{ formatter.custom(toDate(month), { month: 'long' }) }} -->
                            {{ monthNames[month.month] }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select :default-value="placeholder.year.toString()" @update:model-value="(v: any) => {
                    if (!v || !placeholder) return;
                    if (Number(v) === placeholder?.year) return;
                    placeholder = placeholder.set({
                        year: Number(v),
                    });
                }
                    ">
                    <SelectTrigger aria-label="Select year" class="w-[40%]">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent class="max-h-[200px]">
                        <SelectItem v-for="yearValue in createDecade({
                            dateObj: date,
                            startIndex: -10,
                            endIndex: 10,
                        })" :key="yearValue.toString()" :value="yearValue.year.toString()">
                            {{ yearValue.year }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CalendarHeading>
        </CalendarHeader>

        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
            <CalendarGrid v-for="month in grid" :key="month.value.toString()">
                <CalendarGridHead>
                    <CalendarGridRow class="space-x-4">
                        <!-- <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell> -->
                        <CalendarHeadCell v-for="(day, index) in weekDays" :key="day">
                            {{ weekdayNames[index + 1] }}
                        </CalendarHeadCell>
                        <!-- Use the custom weekday names based on the index -->
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody class="grid">
                    <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full space-x-4">
                        <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                            <CalendarCellTrigger :day="weekDate" :month="month.value" />
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
</template>
