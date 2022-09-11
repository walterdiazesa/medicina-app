/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import React, { useEffect } from "react";
import { Test } from "../../../types/Prisma/Test";
import { getTestId, getTestItemName } from "../../../types/Test";
import {
  Page,
  Text,
  View,
  Document as PDFDocument,
  StyleSheet,
  Link,
  Image,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

/* Font.register({
  family: "Source Sans Pro",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf",
    }, // font-style: normal, font-weight: normal
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf",
      fontWeight: "semibold",
    },
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v21/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vAkA.ttf",
      fontWeight: "bold",
    },
  ],
}); */

const HeaderItem = ({ children }: { children: string | JSX.Element }) => {
  return (
    <Text
      style={{
        fontWeight: 700,
        fontSize: 7,
        lineHeight: "0.5mm",
      }}
    >
      <Text style={{ fontWeight: 600 }}>{children}</Text>
    </Text>
  );
};

const ReportItem = ({
  element,
  value,
  right = false,
}: {
  element: string;
  value: string;
  right?: boolean;
}) => {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text
        style={{
          fontWeight: 700,
          fontSize: 7,
          lineHeight: "0.5mm",
          width: !right ? "1.1cm" : "3.35cm",
        }}
      >
        {element}:
      </Text>
      <Text style={{ fontWeight: 600, fontSize: 7, lineHeight: "0.5mm" }}>
        {value}
      </Text>
    </View>
  );
};

const Document = ({ test, qr }: { test: Test; qr?: string }) => {
  return (
    <PDFDocument
      title={getTestId(test)}
      author="Flemik"
      subject="Exámen generado por Flemik"
      creator="Flemik"
      producer="Flemik"
      keywords="test,chem,automated"
    >
      <Page
        size="A4"
        style={{
          paddingHorizontal: "5mm",
          paddingVertical: "7mm",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text>Hola</Text>
      </Page>
    </PDFDocument>
  );
};

export default Document;
