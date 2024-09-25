"use server";

import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";

async function getGoogleAuth() {
  try {
    // 서비스 계정 인증을 위한 키 파일 로드
    const keyFilePath = path.join(process.cwd(), "google_credentials.json"); // 서비스 계정 키 경로
    const keyFile = await fs.readFile(keyFilePath, "utf8");
    const credentials = JSON.parse(keyFile);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    return auth;
  } catch (error) {
    console.error("Error loading Google Sheet:", error);
    throw new Error("Failed to load Google Sheet");
  }
}

async function loadGoogleSheets() {
  try {
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
  } catch (error) {
    console.error("Error loading Google Sheet:", error);
    throw new Error("Failed to load Google Sheet");
  }
}

// Google Sheets에 데이터를 추가하는 서버 함수
export async function addRow(sheetName: string, data: string[][]) {
  try {
    const sheets = await loadGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SPREAD_SHEET_ID;

    // 스프레드시트에 값을 추가하는 요청
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "\b" + sheetName,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: data, // 2차원 배열로 전달
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding row to Google Sheet:", error);
    throw new Error("Failed to add row");
  }
}
