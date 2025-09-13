type OverlayState = "close" | "new" | "edit" | "filter";
type HandleOverlay = (overlay: OverlayState) => void;
interface RecordFilter {
  expence: boolean;
  income: boolean;
  transfer: boolean;
  desc: boolean;
}
export { type OverlayState, type HandleOverlay, type RecordFilter };
