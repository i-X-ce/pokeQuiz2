import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let resultLength: number = 0;
  let result: boolean[] = [];
  const resultStr = req.nextUrl.searchParams.get("result");
  if (resultStr) {
    resultLength = Number(resultStr[0]);
    const resultNum = Number(resultStr.slice(1));
    if (isNaN(resultNum)) {
      resultLength = 0;
    }
    result = new Array(resultLength);
    for (let i = 0; i < resultLength; i++) {
      result[i] = (resultNum & (1 << i)) !== 0;
    }
  }

  const resultSize: string = "80px";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "#f0f0f0",
          fontSize: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            id="_レイヤー_1"
            data-name="レイヤー_1"
            viewBox="0 0 205.61 195.07"
          >
            <path d="M77.16,143.26c0-21.31-17.27-38.58-38.58-38.58S0,121.95,0,143.26s17.27,38.58,38.58,38.58c1.52,0,3.01-.1,4.48-.27,19.2-2.22,34.1-18.52,34.1-38.32Z" />
            <path d="M139.16,91.44c6.06-.78,23.4-3.72,35.36-16.46,4.58-4.88,7.14-9.88,7.52-10.63,3.11-6.24,4.67-13.26,4.67-21.07,0-28.85-18.9-43.28-56.69-43.28H60.59c-12.15,0-22,9.85-22,22v50.41c0,9.71,6.18,18.48,15.46,21.37,21.16,6.58,36.53,26.33,36.53,49.66,0,7.33-1.52,14.31-4.26,20.64-6.34,14.63,4,30.99,19.95,30.99h36.56c41.85,0,62.79-18.49,62.79-55.47,0-32.1-22.16-48.16-66.45-48.16ZM115.58,74.54c-1.02.12-2.05.18-3.1.18-14.74,0-26.7-11.95-26.7-26.7s11.95-26.7,26.7-26.7,26.7,11.95,26.7,26.7c0,13.69-10.31,24.97-23.6,26.51Z" />
          </svg>
          <div style={{ display: "flex", margin: "20px 0", gap: 20 }}>
            {result.map((r: boolean, i: number) => (
              <svg
                viewBox="0 0 24 24"
                style={{ width: resultSize, height: resultSize }}
                key={i}
              >
                <path
                  style={{ fill: r ? "#fa4949" : "#3e98ff" }}
                  d={
                    r
                      ? "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"
                      : "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  }
                ></path>
              </svg>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
