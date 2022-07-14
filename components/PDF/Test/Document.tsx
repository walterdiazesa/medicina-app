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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            height: "2cm",
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <HeaderItem>{test.lab!.name}</HeaderItem>
            <HeaderItem>{test.lab!.address}</HeaderItem>
            <HeaderItem>{test.lab!.publicPhone}</HeaderItem>
            {test.lab!.web && (
              <HeaderItem>
                <Link src={test.lab!.web}>{test.lab!.web}</Link>
              </HeaderItem>
            )}
            <HeaderItem>{test.lab!.publicEmail}</HeaderItem>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View style={{ flexGrow: 1 }} />
            <Image src={test.lab!.img} style={{ objectFit: "contain" }} />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "lightgray",
            height: "0.4mm",
            width: "100%",
            marginVertical: "2mm",
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            height: "1.4cm",
          }}
        >
          <View style={{ flex: 1 }}>
            <ReportItem element="Solicitud" value={getTestId(test)} />
            <ReportItem element="Paciente" value={test.patient!.name} />
            <ReportItem element="ID" value={test.patient!.dui} />
            <ReportItem element="Sexo" value={test.sex} />
            <ReportItem
              element="Edad"
              value={`${new Date(
                test.patient!.dateBorn
              ).toLocaleDateString()} (${new Date(test.patient!.dateBorn).diff(
                new Date(),
                "year"
              )} años)`}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ReportItem
              element="Fecha y hora de la solicitud"
              value={new Date(test.date).format("DD/MM/YYYY HH:MM A")}
              right
            />
            <ReportItem
              element="Creado por"
              value={test.issuer?.name || test.lab!.name}
              right
            />
            <ReportItem
              element="Fecha y hora de la validación"
              value={
                test.validated
                  ? new Date(test.validated).format("DD/MM/YYYY HH:MM A")
                  : ""
              }
              right
            />
            <ReportItem
              element="Validado por"
              value={test.validator?.name || ""}
              right
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "lightgray",
            height: "0.4mm",
            width: "100%",
            marginVertical: "2mm",
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "20cm",
          }}
        >
          <View
            style={{
              flex: 1,
              maxWidth: "6.6cm",
              minWidth: "6.6cm",
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 7,
                lineHeight: "0.5mm",
                paddingHorizontal: "0.75mm",
              }}
            >
              Prueba
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              maxWidth: "6cm",
              minWidth: "6cm",
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 7,
                lineHeight: "0.5mm",
                paddingHorizontal: "0.75mm",
              }}
            >
              Resultado
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              maxWidth: "2.4cm",
              minWidth: "2.4cm",
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 7,
                lineHeight: "0.5mm",
                paddingHorizontal: "0.75mm",
              }}
            >
              Unidad
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              maxWidth: "5cm",
              minWidth: "5cm",
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: 7,
                lineHeight: "0.5mm",
                paddingHorizontal: "0.75mm",
              }}
            >
              Rango de referencia
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "darkgray",
            height: "0.4mm",
            width: "100%",
            marginTop: "0.5mm",
            marginBottom: "0.7mm",
          }}
        />
        {test.tests.map((item) => (
          <View
            key={item.name}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "20cm",
              borderBottom: "0.3mm dashed #C8C8C8",
              marginBottom: "0.7mm",
            }}
          >
            <View
              style={{
                flex: 1,
                maxWidth: "6.6cm",
                minWidth: "6.6cm",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 7,
                  lineHeight: "0.5mm",
                  paddingHorizontal: "0.75mm",
                }}
              >
                {getTestItemName(item.name).name} {item.assign}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                maxWidth: "6cm",
                minWidth: "6cm",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 7,
                  lineHeight: "0.5mm",
                  paddingHorizontal: "0.75mm",
                }}
              >
                {item.value.replace(/[a-zA-Z]/g, "").replace("/", "")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                maxWidth: "2.4cm",
                minWidth: "2.4cm",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 7,
                  lineHeight: "0.5mm",
                  paddingHorizontal: "0.75mm",
                }}
              >
                {item.value.replace(/\d/g, "")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                maxWidth: "5cm",
                minWidth: "5cm",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 7,
                  lineHeight: "0.5mm",
                  paddingHorizontal: "0.75mm",
                }}
              >
                {!item.range
                  ? "-"
                  : `${item.range.between.from} - ${item.range.between.to}`}
              </Text>
            </View>
          </View>
        ))}
        <View
          style={{
            position: "absolute",
            bottom: "7mm",
            left: "5mm",
            right: 0,
          }}
          fixed
        >
          {test.remark && (
            <Text
              render={({ pageNumber, totalPages }) =>
                pageNumber === totalPages
                  ? `Observaciones: ${test.remark!.text}`
                  : ""
              }
              style={{
                fontWeight: 700,
                fontSize: 7,
                lineHeight: "0.5mm",
                marginBottom: "1mm",
              }}
            />
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            {test.validator?.signature &&
              test.validator.signature.includes(
                "user-signatures.s3.filebase.com"
              ) && (
                <Image
                  style={{
                    flex: 1,
                    objectFit: "contain",
                    maxWidth: "3cm",
                    maxHeight: "1.5cm",
                    minWidth: "3cm",
                    minHeight: "1.5cm",
                  }}
                  src={test.validator.signature}
                />
              )}
            {test.validator?.stamp &&
              test.validator.stamp.includes(
                "user-signatures.s3.filebase.com"
              ) && (
                <Image
                  style={{
                    flex: 1,
                    objectFit: "contain",
                    maxWidth: "6cm",
                    maxHeight: "2.5cm",
                    minWidth: "6cm",
                    minHeight: "2.5cm",
                    marginLeft: "0.4cm",
                  }}
                  src={test.validator.stamp}
                />
              )}
            <View
              style={{
                flex: 1,
                objectFit: "contain",
                maxWidth: "0.1mm",
                maxHeight: "2.5cm",
                minWidth: "0.1mm",
                minHeight: "2.5cm",
              }}
            />
          </View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 7,
              lineHeight: "0.5mm",
            }}
          >
            {test.validator?.name || ""}
          </Text>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 7,
              lineHeight: "0.5mm",
            }}
          >
            Persona validadora de esta solicitud
          </Text>
        </View>
        {test.lab?.preferences.useQR && qr && (
          <View
            style={{
              position: "absolute",
              bottom: "7mm",
              left: 0,
              right: "5mm",
            }}
            fixed
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "flex-end",
              }}
            >
              <Image
                src={qr}
                style={{
                  flex: 1,
                  objectFit: "contain",
                  maxWidth: "3cm",
                  maxHeight: "3cm",
                  minWidth: "3cm",
                  minHeight: "3cm",
                  alignSelf: "flex-end",
                }}
              />
            </View>
          </View>
        )}
      </Page>
    </PDFDocument>
  );
};

export default Document;
