"use client";
import { Title } from "@/app/components/common/Title";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { UserInfo } from "@/app/components/ranking/UserInfo";
import { Loading } from "@/app/components/common/Loading";
import { WorkspacePremium } from "@mui/icons-material";

interface User {
  nickname: string;
  correctCnt: number;
  answerCnt: number;
  correctRate: number;
  image: string;
  createCnt: number;
  solvedCnt: number;
}

const userLimitPerPage = 15;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const loadingUser = (sortType: string) => {
    axios
      .get("/api/user/get-view", {
        params: { index: 0, size: userLimitPerPage, sortType },
      })
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      });
  };

  const handleSelector = (e: SelectChangeEvent) => {
    loadingUser(e.target.value);
  };

  useEffect(() => {
    loadingUser("correct");
  }, []);

  if (users.length <= 0) return <Loading />;

  return (
    <>
      <Title color="yellow" title="ランキング" />
      <span className={styles.center}>
        <FormControl>
          <InputLabel color="primary">ランキング</InputLabel>
          <Select
            defaultValue="correct"
            label="ランキング"
            color="primary"
            onChange={handleSelector}
          >
            <MenuItem value="correct">正答数ランキング</MenuItem>
            <MenuItem value="answer">回答数ランキング</MenuItem>
            <MenuItem value="create">作成数ランキング</MenuItem>
            <MenuItem value="solved">解かれた数ランキング</MenuItem>
          </Select>
        </FormControl>
      </span>
      <div className={styles.champions}>
        {users.map(
          (u, i) => i <= 2 && <ChampionCard key={i} user={u} rank={i + 1} />
        )}
      </div>
      <div className={styles.users}>
        <UserInfo rank={0} />
        {users.map((u, i) => (
          <UserInfo key={i} user={u} rank={i + 1} />
        ))}
      </div>
    </>
  );
}

function ChampionCard({ user, rank }: { user: User; rank: number }) {
  const styleColor =
    rank === 1
      ? "rgb(205, 193, 31)"
      : rank === 2
      ? "rgb(160, 160, 160)"
      : "rgb(161, 124, 45)";
  const rankName = rank === 1 ? "First" : rank === 2 ? "Second" : "Third";
  const rankClass =
    rank === 1
      ? styles.championCardFirst
      : rank === 2
      ? styles.championCardSecond
      : styles.championCardThird;

  return (
    <div className={rankClass} style={{ gridArea: rankName }}>
      <div className={styles.championCardIconWrapper}>
        <WorkspacePremium
          sx={{ color: styleColor, fontSize: "var(--font-size-xxxl)" }}
        />
        <div className={styles.championCardRank} style={{ color: styleColor }}>
          {rankName}
        </div>
      </div>
      <div className={styles.championCardContainer}>
        <div
          className={styles.championCardNamePlate}
          style={{ backgroundColor: styleColor }}
        >
          <img
            className={styles.championCardImg}
            src={user.image}
            alt={user.nickname}
          />
          <div className={styles.championCardName}>{user.nickname}</div>
        </div>
        <div className={styles.championCardDetails}>
          <ChampionCardCell
            title="問題作成数"
            value={user.createCnt || 0}
            styleColor={styleColor}
          />
          <ChampionCardCell
            title="正答数"
            value={user.correctCnt || 0}
            styleColor={styleColor}
          />
          <ChampionCardCell
            title="回答数"
            value={user.answerCnt || 0}
            styleColor={styleColor}
          />
          <ChampionCardCell
            title="正答率"
            value={(user.correctRate * 100).toFixed(1) + "%"}
            styleColor={styleColor}
          />
          <ChampionCardCell
            title="解かれた数"
            value={user.solvedCnt || 0}
            styleColor={styleColor}
          />
        </div>
      </div>
    </div>
  );
}

function ChampionCardCell({
  title,
  value,
  styleColor,
}: {
  title: string;
  value: string | number;
  styleColor: string;
}) {
  return (
    <div className={styles.championCardDetailCell}>
      <div className={styles.championCardDetailCellTitle}>{title}</div>
      <div
        className={styles.championCardDetailCellValue}
        style={{ color: styleColor }}
      >
        {value}
      </div>
    </div>
  );
}
