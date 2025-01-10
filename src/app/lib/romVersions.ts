export const romVersions: Array<{
  label: string;
  id: string;
  color: "red" | "green" | "blue" | "yellow";
}> = [
  { label: "赤初期", id: "R0", color: "red" },
  { label: "赤後期", id: "R1", color: "red" },
  { label: "緑初期", id: "G0", color: "green" },
  { label: "緑後期", id: "G1", color: "green" },
  { label: "青", id: "B", color: "blue" },
  { label: "ピカ初期", id: "Y0", color: "yellow" },
  { label: "ピカ後期", id: "Y1", color: "yellow" },
];

export function getRomVersionLabel(id: string) {
  return romVersions.find((v) => v.id === id)?.label || "不明";
}

export const getRomVersionColor = (id: string): "red" | "green" | "blue" | "yellow" | "gray" => {
  return romVersions.find((v) => v.id === id)?.color || "gray";
};
