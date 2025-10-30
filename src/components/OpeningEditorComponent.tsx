import { Box, Typography, TextField, Switch, FormControlLabel, Paper, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

export type DayKey =
    | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type OpeningHour = { day: DayKey; open: string; close: string; closed?: boolean };

const DAYS: DayKey[] = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

type Props = {
    value?: OpeningHour[];
    onChange?: (hours: { day: DayKey; open: string; close: string }[]) => void;
    defaultOpen?: string;
    defaultClose?: string;
};

function titleCase(day: DayKey) {
    return day.charAt(0) + day.slice(1).toLowerCase();
}
function clampHHmm(v: string) {
    return /^\d{2}:\d{2}$/.test(v) ? v : "00:00";
}

function OpeningHourRow({
                            row,
                            onToggleOpen,
                            onChangeOpen,
                            onChangeClose,
                        }: {
    row: OpeningHour;
    onToggleOpen: (checked: boolean) => void;
    onChangeOpen: (val: string) => void;
    onChangeClose: (val: string) => void;
}) {
    const disabled = !!row.closed;

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ width: 130, fontWeight: 600 }}>{titleCase(row.day)}</Box>

            <FormControlLabel
                control={<Switch checked={!row.closed} onChange={(_, c) => onToggleOpen(c)} />}
                label={row.closed ? "Closed" : "Open"}
            />

            <Tooltip title={disabled ? "Closed" : ""}>
        <span>
          <TextField
              type="time"
              size="small"
              label="Opens"
              value={row.open}
              onChange={(e) => onChangeOpen(clampHHmm(e.target.value))}
              disabled={disabled}
              sx={{ minWidth: 140 }}
              inputProps={{ step: 300 }}
          />
        </span>
            </Tooltip>

            <Tooltip title={disabled ? "Closed" : ""}>
        <span>
          <TextField
              type="time"
              size="small"
              label="Closes"
              value={row.close}
              onChange={(e) => onChangeClose(clampHHmm(e.target.value))}
              disabled={disabled}
              sx={{ minWidth: 140 }}
              inputProps={{ step: 300 }}
          />
        </span>
            </Tooltip>
        </Box>
    );
}

export default function OpeningHoursEditor({
                                               value,
                                               onChange,
                                               defaultOpen = "09:00",
                                               defaultClose = "17:00",
                                           }: Props) {
    const initial: OpeningHour[] = DAYS.map((day) => ({
        day,
        open: defaultOpen,
        close: defaultClose,
        closed: day === "SUNDAY"
    }));
    const [rows, setRows] = useState<OpeningHour[]>(initial);

    // hydrate from value
    useEffect(() => {
        if (!value) return;
        const map = new Map<DayKey, OpeningHour>();
        value.forEach((v) => map.set(v.day, v));
        const merged = DAYS.map((day) => {
            const found = map.get(day);
            if (!found) return { day, open: defaultOpen, close: defaultClose, closed: true };
            return { day, open: clampHHmm(found.open), close: clampHHmm(found.close), closed: !!found.closed };
        });
        setRows(merged);
    }, [value, defaultOpen, defaultClose]);

    const update = (i: number, patch: Partial<OpeningHour>) => {
        setRows(prev => {
            const next = prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
            // Emit only open days to parent
            onChange?.(next.filter(r => !r.closed).map(r => ({
                day: r.day,
                open: r.open,
                close: r.close
            })));
            return next;
        });
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={1.5}>Opening hours</Typography>
            <Stack spacing={1.5}>
                {rows.map((row, i) => (
                    <OpeningHourRow
                        key={row.day}
                        row={row}
                        onToggleOpen={(checked) => update(i, { closed: !checked })}
                        onChangeOpen={(val) => update(i, { open: val })}
                        onChangeClose={(val) => update(i, { close: val })}
                    />
                ))}
            </Stack>
        </Paper>
    );
}
