/**
 * Company statistics.
 *
 * IMPORTANT: these values are PLACEHOLDERS, not verified achievements. While
 * `statsArePlaceholders` is true the metrics are not shown anywhere.
 * TODO(owner): replace with real, verifiable figures and set it to false.
 */
export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export const statsArePlaceholders = true;

export const stats: Stat[] = [
  {
    value: 50,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    value: 10,
    suffix: "+",
    label: "Industries Served",
  },
  {
    value: 99,
    suffix: "%",
    label: "Smooth launches",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Monitoring",
  },
];
