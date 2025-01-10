import { romVersions } from "@/app/lib/romVersions";
import styles from "./style.module.css";

import { Chip } from "@mui/material";

export function VersionSelector({
  versions,
  setVersions,
}: {
  versions: string[];
  setVersions: (versions: string[]) => void;
}) {
  // const [clicked, setClicked] = useState<boolean[]>(
  //   Array(romVersions.length).fill(true)
  // );

  return (
    <div className={styles.container}>
      {romVersions.map((v) => (
        <Chip
          key={v.id}
          label={v.label}
          color={versions.includes(v.id) ? v.color : "gray"}
          variant={!versions.includes(v.id) ? "outlined" : "filled"}
          onClick={() => {
            const newVersions = versions.includes(v.id)
              ? versions.filter((id) => id !== v.id)
              : [...versions, v.id];
            setVersions(newVersions);
          }}
        />
      ))}
    </div>
  );
}
