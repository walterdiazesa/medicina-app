export interface TestItem {
  name: string;
  assign: string; // "=" | "<"
  value: string;
  range?: { item: number; between: { from: number; to: number } };
}

const testItemKeyValue: {
  [key: string]: { name: string; desc: string; group: string };
} = {
  ALP: {
    name: "Fosfatasa Alcalina",
    desc: "Diagnosticar enfermedad del hígado o del hueso. Verificar si los tratamientos para dichas enfermedades están funcionando. Como parte de las pruebas de la función hepática de rutina.",
    group: "Enzimas",
  },
  AMYL: {
    name: "Amilasa",
    desc: "Este examen se realiza casi siempre para diagnosticar o vigilar una pancreatitis aguda. También puede detectar algunos problemas del tubo digestivo.",
    group: "Enzimas",
  },
  CHE: {
    name: "Colinesterasa",
    desc: "La 	disminución 	en 	los 	niveles 	de seudocolinesterasa puede deberse a: Infección aguda, Desnutrición crónica, Ataque cardíaco, Daño hepático, Metástasis, Ictericia obstructiva, Intoxicación con organofosfatos (químicos que se encuentran en los pesticidas). Las disminuciones más pequeñas pueden deberse a: Embarazo, Uso de anticonceptivos orales",
    group: "Enzimas",
  },
  CKMB: {
    name: "Creatino fosfoquinasa isoenzima MB",
    desc: "Infarto agudo de miocardio",
    group: "Enzimas",
  },
  CPK: {
    name: "Creatina fosfoquinasa",
    desc: "Distrofia muscular,  infarto agudo de miocardio",
    group: "Enzimas",
  },
  GGT: {
    name: "Gamma glutamil transferasa",
    desc: "Alcoholismo, Diabetes, Bloqueo del flujo de la bilis desde el hígado (colestasis), Insuficiencia cardíaca, Hepatitis Isquemia hepática (falta de flujo de sangre), Necrosis hepática Tumor hepático, Enfermedad pulmonar, Enfermedad del páncreas, Cicatrización del hígado (cirrosis), Uso de drogas hepatotóxicas",
    group: "Enzimas",
  },
  GOT: {
    name: "Aspartato aminotransferasa",
    desc: "Cirrosis (cicatrización del hígado), Muerte del tejido hepático, Ataque cardíaco, Hemocromatosis, Hepatitis Falta de flujo sanguíneo al hígado (isquemia hepática), Cáncer o tumor del hígado",
    group: "Enzimas",
  },
  AST: {
    name: "Aspartato aminotransferasa",
    desc: "Cirrosis (cicatrización del hígado), Muerte del tejido hepático, Ataque cardíaco, Hemocromatosis, Hepatitis Falta de flujo sanguíneo al hígado (isquemia hepática), Cáncer o tumor del hígado",
    group: "Enzimas",
  },
  GPT: {
    name: "Alanina aminotransferasa",
    desc: "Medicamentos hepatotóxicos, Mononucleosis, Trauma o enfermedad muscular, Pancreatitis (inflamación e hinchazón del páncreas), Quemaduras (profundas), Procedimientos cardíacos, Convulsiones, Cirugía",
    group: "Enzimas",
  },
  ALT: {
    name: "Alanina aminotransferasa",
    desc: "Medicamentos hepatotóxicos, Mononucleosis, Trauma o enfermedad muscular, Pancreatitis (inflamación e hinchazón del páncreas), Quemaduras (profundas), Procedimientos cardíacos, Convulsiones, Cirugía",
    group: "Enzimas",
  },
  LAP: {
    name: "Leucina aminopeptidasa",
    desc: "Bloqueo de la bilis que fluye del hígado (colestasis), Cirrosis, Hepatitis, Cáncer del hígado, Isquemia hepática (reducción del flujo sanguíneo al hígado), Necrosis hepática (muerte del tejido hepático), Tumor hepático, Uso de drogas hepatotóxicas",
    group: "Enzimas",
  },
  LDH: {
    name: "Lactato deshidrogenasa",
    desc: "Ataque cardíaco, Anemia hemolítica, Hipotensión, Mononucleosis infecciosa, Isquemia intestinal (deficiencia sanguínea) e infarto (necrosis), Miocardiopatía isquémica, hepatitis, Necrosis pulmonar, Lesión muscular, Distrofia muscular, Pancreatitis, Accidente cerebrovascular",
    group: "Enzimas",
  },
  ALB: {
    name: "Albúmina",
    desc: "Los niveles de albúmina en suero por debajo de lo normal pueden ser un signo de: Enfermedades renales, Enfermedad hepática (por ejemplo, hepatitis o cirrosis que puede causar ascitis). Después de una cirugía para bajar de peso, Enfermedad de Crohn, Dietas bajas en proteínas, Esprúe, Enfermedad de Whipple. El aumento en el nivel de albúmina en la sangre puede deberse a: Deshidratación, Dieta rica en proteína, Quemaduras (extensas), Enfermedad de Wilson",
    group: "Química General",
  },
  BUN: {
    name: "Nitrógeno ureico sanguíneo",
    desc: "Los niveles superiores a lo normal pueden deberse a: Insuficiencia cardíaca congestiva, Niveles excesivos de proteínas en el tubo digestivo, Sangrado gastrointestinal, Hipovolemia (deshidratación), Ataque cardíaco, Enfermedad renal, incluso glomerulonefritis, pielonefritis y necrosis tubular aguda, Insuficiencia renal, Shock, Obstrucción de las vías urinarias. Los niveles inferiores a lo normal pueden deberse a: Insuficiencia hepática, Dieta baja en proteína, Desnutrición y Sobrehidratación",
    group: "Química General",
  },
  CA: {
    name: "Calcio",
    desc: "Hiperparatiroidismo,Infecciones que causan granulomas, Tumor metastásico del hueso, Mieloma múltiple, Osteomalacia, Hiperactividad de la glándula tiroides (hipertiroidismo), Enfermedad de Paget, Sarcoidosis, Tumores que producen una sustancia similar a la hormona paratiroidea, Hipoparatiroidismo, Insuficiencia renal, Nivel bajo de albúmina en la sangre, Enfermedad hepática, Deficiencia de magnesio, Osteomalacia , Pancreatitis y Deficiencia de vitamina D",
    group: "Química General",
  },
  CRE: {
    name: "Creatinina",
    desc: "insuficiencia o daño en el riñón, infección o reducción del flujo de sangre, Pérdida de líquido corporal (deshidratación), Problemas musculares, como descomposición de las fibras musculares (rabdomiólisis), Problemas durante el embarazo, como convulsiones, eclampsia o hipertensión arterial causada por el embarazo (preeclampsia), miastenia grave, Problemas musculares, pérdida muscular avanzada (distrofia muscular).",
    group: "Química General",
  },
  DBIL: {
    name: "Bilirrubina directa",
    desc: "Eritroblastosis fetal, Anemia hemolítica, Reacción a una transfusión, Cirrosis (cicatrización del hígado), Hepatitis, Enfermedad hepática, Enfermedad de Gilbert, Estenosis biliar, Cáncer del páncreas o de la vesícula biliar y Cálculos biliares.",
    group: "Química General",
  },
  GLU: {
    name: "Glucosa",
    desc: "Diabetes, Hipo Glicemia: puede causar debilidad, confusión, irritabilidad, hambre o cansancio. Híper Glicemia: Tener un nivel alto de glucosa en la sangre significa puede significa que no tiene suficiente insulina en su cuerpo",
    group: "Química General",
  },
  HDLC: {
    name: "Colesterol de lipoproteínas de alta densidad",
    desc: "Su disminución indica riesgo de enfermedad cardiaca y arterosclerosis.",
    group: "Química General",
  },
  IP: {
    name: "Fósforo inorgánico",
    desc: "Cetoacidosis diabética, Hipoparatiroidismo, Insuficiencia renal, Enfermedad hepática, Demasiada vitamina D, Demasiado fosfato en la alimentación , Uso de ciertos medicamentos como laxantes que contengan fosfato, Alcoholismo, Hipercalciemia, Hiperparatiroidismo, Muy poca ingesta de fosfato en la dieta, Desnutrición grave, Muy poca vitamina D, lo que ocasiona raquitismo (niñez) u osteomalacia (adultez)",
    group: "Química General",
  },
  MG: {
    name: "Magnesio",
    desc: "Un nivel alto de magnesio puede indicar: Enfermedad de Addison, Insuficiencia renal crónica, Deshidratación, Acidosis diabética, Oliguria, Un nivel bajo de magnesio puede indicar: Alcoholismo, Diarrea crónica, Delirium tremens, Hemodiálisis, 	Cirrosis 	hepática 	(hígado), Hiperaldosteronismo, 	Hipoparatiroidismo, Pancreatitis, Demasiada insulina, Toxemia del embarazo, Colitis ulcerativa",
    group: "Química General",
  },
  NH3: {
    name: "Amoníaco",
    desc: "Insuficiencia cardíaca congestiva, Sangrado gastrointestinal, por lo general en las vías digestivas altas, Enfermedades genéticas del ciclo de la urea, Temperatura corporal alta (hipertermia), Leucemia, Insuficiencia hepática, Nivel bajo de potasio en la sangre (hipocaliemia), Alcalosis metabólica, Esfuerzo muscular intenso",
    group: "Química General",
  },
  TBIL: {
    name: "Bilirrubina total",
    desc: "Eritroblastosis fetal, Anemia hemolítica, Reacción a una transfusión, Cirrosis (cicatrización del hígado), Hepatitis, Enfermedad hepática, Enfermedad de Gilbert, Estenosis biliar, Cáncer del páncreas o de la vesícula biliar y Cálculos biliares",
    group: "Química General",
  },
  TCHO: {
    name: "Colesterol total",
    desc: "Los niveles elevados en la sangre pueden aumentar el riesgo de enfermedades cardíacas",
    group: "Química General",
  },
  TG: {
    name: "Triglicéridos",
    desc: "Los niveles elevados en la sangre pueden aumentar el riesgo de enfermedades cardíacas",
    group: "Química General",
  },
  TP: {
    name: "Proteína total",
    desc: "Los niveles superiores a los niveles normales pueden deberse a: Inflamación o infección crónica, incluso VIH y hepatitis B o C, Mieloma múltiple, Enfermedad de Waldenstrom. Los niveles inferiores a los normales pueden deberse a: Agamaglobulinemia, Sangrado (hemorragia), Quemaduras (extensas), Glomerulonefritis, Enfermedad hepática, Malabsorción Desnutrición, Síndrome nefrótico, Enteropatía por pérdida de proteína.",
    group: "Química General",
  },
  UA: {
    name: "Ácido úrico",
    desc: "Los niveles de ácido úrico por encima de lo normal (hiperuricemia) pueden deberse a: Acidosis, Alcoholismo, Efectos secundarios relacionados con la quimioterapia, Diabetes, Ejercicio excesivo, Gota, Hipoparatiroidismo, Intoxicación con plomo, Leucemia, Enfermedad renal quística medular, Nefrolitiasis, Policitemia vera, Dieta rica en purinas, Insuficiencia renal, Toxemia del embarazo. Los niveles de ácido úrico por debajo de lo normal pueden deberse a: Síndrome de Fanconi, Dieta baja en purinas, Síndrome de secreción inadecuada de hormona antidiurética (SIHAD), Enfermedad de Wilson,",
    group: "Química General",
  },
  CRP: {
    name: "Proteína C-reactiva",
    desc: "Es un examen general para verificar si hay una inflamación en alguna parte del cuerpo. Puede ser Indicador de procesos febriles.",
    group: "Inmunológica",
  },
  NA: {
    name: "Sodio",
    desc: "Síndrome de Cushing o el hiperaldosteronismo,  Diabetes insípida,  Deshidratación, vómitos o diarrea.",
    group: "Electrolitos",
  },
  K: {
    name: "Potasio",
    desc: "Hipercalcemia, hipocalemia, Deshidratación, vómitos o diarrea.",
    group: "Electrolitos",
  },
  CI: {
    name: "Cloruro",
    desc: "Un nivel de cloruro superior a lo normal se denomina hipercloremia y puede deberse a: Intoxicación con bromuro, Inhibidores de la anhidrasa carbónica (utilizados para tratar glaucoma), Diarrea, Acidosis metabólica, Alcalosis respiratoria (compensada), Acidosis tubular renal Un nivel de cloruro inferior a lo normal se denomina hipocloremia y puede deberse a: Enfermedad de Addison, Síndrome de Bartter, Quemaduras, Insuficiencia cardíaca congestiva, Deshidratación, Sudoración excesiva, Succión gástrica, Hiperaldosteronismo, Alcalosis metabólica, Acidosis respiratoria (compensada), Síndrome de secreción inadecuada de hormona antidiurética (SIHAD), Vómitos",
    group: "Electrolitos",
  },
};

export const getTestItemName = (test: string) => {
  return (
    testItemKeyValue[test.toUpperCase().replace("-PS", "")] || {
      name: test,
      desc: "unknown property",
      group: "unknown property",
    }
  );
};

export interface Test {
  id?: string;
  labId: string;
  patientId: string;
  sex: "Masculino" | "Femenino" | "No especificado";
  date: Date;
  tests: TestItem[];
}
