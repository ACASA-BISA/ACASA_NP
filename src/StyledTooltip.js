import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#61c258" : "#4ba046",
    color: theme.palette.mode === "dark" ? "#000" : "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    borderRadius: "6px",
    padding: "6px 10px",
    boxShadow: theme.palette.mode === "dark" ? "0px 4px 12px rgba(97, 194, 88, 0.6)" : "0px 4px 12px rgba(75, 160, 70, 0.6)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === "dark" ? "#61c258" : "#4ba046",
  },
}));

export default StyledTooltip;