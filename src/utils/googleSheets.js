const GOOGLE_SHEET_ID = "1nXdsMMm3pG09HuROcjzXlnr1cbIR7v6HtA9QyvdMr2M";
const GOOGLE_SHEET_GID = "0";

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const cleanSheetValue = (value) =>
  String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/""/g, '"')
    .trim();

const cleanTitleValue = (value) => cleanSheetValue(value).replace(/,$/, "").trim();

const parseCsvRows = (csvText) => {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === ',' && !insideQuotes) {
      currentRow.push(cleanSheetValue(currentValue));
      currentValue = "";
      continue;
    }

    if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && nextCharacter === '\n') {
        index += 1;
      }

      currentRow.push(cleanSheetValue(currentValue));
      if (currentRow.some((value) => value !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  if (currentValue || currentRow.length) {
    currentRow.push(cleanSheetValue(currentValue));
    if (currentRow.some((value) => value !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const mapCsvObjects = (csvText) => {
  const rows = parseCsvRows(csvText);

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);

  return rows.slice(1).map((values) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = values[index] || "";
    });

    return item;
  });
};

const isPublished = (value) => !["", "0", "false", "nie", "no"].includes(String(value || "").trim().toLowerCase());

const mapSheetRowToFeature = (row) => ({
  title: cleanTitleValue(row.title || row.nazwa || row.naglowek || "Wydarzenie Dolinka Olkusz"),
  text: cleanSheetValue(row.text || row.opis || row.description || row.tresc || ""),
  img: cleanSheetValue(row.img || row.image || row.obraz || row.zdjecie || row.photo || "img/logo.jpg"),
  date: row.date || row.data || "",
  order: Number(row.order || row.kolejnosc || 0),
});

export const getGoogleSheetTemplateUrl = () =>
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit#gid=${GOOGLE_SHEET_GID}`;

export const fetchSheetFeatures = async () => {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${GOOGLE_SHEET_GID}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Sheets zwrocil status ${response.status}.`);
  }

  const rawText = await response.text();
  const rows = mapCsvObjects(rawText);
  const features = rows
    .filter((row) => isPublished(row.published ?? row.publish ?? row.widoczne ?? row.aktywne ?? "true"))
    .map(mapSheetRowToFeature)
    .filter((item) => item.title && item.text);

  if (!features.length) {
    throw new Error("Arkusz nie zawiera poprawnych rekordow wydarzen.");
  }

  const hasCustomOrder = features.some((item) => item.order > 0);
  return hasCustomOrder
    ? [...features].sort((left, right) => left.order - right.order)
    : features;
};