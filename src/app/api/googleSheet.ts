"use server";

import { google } from "googleapis";

async function getGoogleAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials:{
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
      },
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
