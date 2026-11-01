import { LabTest } from '../types/index.js';

export const LAB_TESTS_DATA: LabTest[] = [
  // 1. Blood Tests
  {
    id: 'blood-cbc',
    category: 'Blood Tests',
    name: 'Complete Blood Count (CBC) with ESR',
    code: 'HEM-01',
    description: 'Measures RBCs, WBCs, Platelets, Hemoglobin, Hematocrit, and Erythrocyte Sedimentation Rate to screen for anemia and infections.',
    fastingRequired: false,
    sampleType: 'EDTA Whole Blood (2 ml)',
    turnaround: 'Same day (3 hours)',
    popular: true
  },
  {
    id: 'blood-fbs-ppbs',
    category: 'Blood Tests',
    name: 'Fasting Blood Sugar (FBS) & PPBS',
    code: 'BIO-02',
    description: 'Essential diabetes screening and monitoring tests evaluating glucose regulation before and after meals.',
    fastingRequired: true,
    sampleType: 'Fluoride Plasma',
    turnaround: 'Same day (2 hours)',
    popular: true
  },
  {
    id: 'blood-lipid',
    category: 'Blood Tests',
    name: 'Lipid Profile Comprehensive',
    code: 'BIO-03',
    description: 'Cholesterol, HDL, LDL, VLDL, and Triglycerides to evaluate cardiovascular risk and lipid metabolism.',
    fastingRequired: true,
    sampleType: 'Serum (10-12 hrs fasting)',
    turnaround: 'Same day (4 hours)',
    popular: true
  },
  {
    id: 'blood-lft',
    category: 'Blood Tests',
    name: 'Liver Function Test (LFT)',
    code: 'BIO-04',
    description: 'SGOT/AST, SGPT/ALT, Bilirubin Total/Direct, Alkaline Phosphatase, Total Protein, and Albumin for hepatic health.',
    fastingRequired: false,
    sampleType: 'Serum',
    turnaround: 'Same day (4 hours)'
  },
  {
    id: 'blood-kft',
    category: 'Blood Tests',
    name: 'Kidney Function Test (KFT / RFT)',
    code: 'BIO-05',
    description: 'Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, and Electrolytes (Sodium, Potassium, Chloride).',
    fastingRequired: false,
    sampleType: 'Serum',
    turnaround: 'Same day (3 hours)'
  },
  {
    id: 'blood-thyroid',
    category: 'Blood Tests',
    name: 'Thyroid Profile (Total T3, T4, TSH)',
    code: 'IMM-06',
    description: 'Chemiluminescent immunoassay for evaluating hyperthyroidism, hypothyroidism, and endocrine balance.',
    fastingRequired: false,
    sampleType: 'Serum',
    turnaround: 'Same day (5 hours)',
    popular: true
  },
  {
    id: 'blood-hba1c',
    category: 'Blood Tests',
    name: 'HbA1c (Glycated Hemoglobin HPLC)',
    code: 'BIO-07',
    description: 'Gold-standard 3-month average glucose indicator processed via high-performance liquid chromatography.',
    fastingRequired: false,
    sampleType: 'EDTA Whole Blood',
    turnaround: 'Same day (4 hours)'
  },
  {
    id: 'blood-vitamins',
    category: 'Blood Tests',
    name: 'Vitamin D3 & Vitamin B12 Duo',
    code: 'IMM-08',
    description: 'Assessment of 25-Hydroxy Vitamin D and Cobalamin essential for bone density, nerve health, and fatigue assessment.',
    fastingRequired: false,
    sampleType: 'Serum (protected from light)',
    turnaround: 'Next day (18 hours)'
  },

  // 2. Urine Tests
  {
    id: 'urine-routine',
    category: 'Urine Tests',
    name: 'Routine & Microscopic Urine Analysis',
    code: 'URN-01',
    description: 'Physical, chemical, and microscopic examination for pus cells, RBCs, epithelial cells, casts, crystals, and bacteria.',
    fastingRequired: false,
    sampleType: 'First morning clean-catch midstream urine',
    turnaround: 'Same day (2 hours)',
    popular: true
  },
  {
    id: 'urine-protein',
    category: 'Urine Tests',
    name: '24-Hour Urinary Total Protein',
    code: 'URN-02',
    description: 'Quantitative measurement of proteinuria to evaluate renal glomerular permeability and nephrotic conditions.',
    fastingRequired: false,
    sampleType: '24-Hour collected urine container',
    turnaround: 'Same day (4 hours after collection)'
  },
  {
    id: 'urine-culture',
    category: 'Urine Tests',
    name: 'Urine Culture & Antibiotic Sensitivity (Automated)',
    code: 'MIC-03',
    description: 'Isolation of pathogenic bacteria and automated antibiotic susceptibility testing for targeted UTI therapy.',
    fastingRequired: false,
    sampleType: 'Sterile universal container midstream sample',
    turnaround: '48 to 72 hours'
  },
  {
    id: 'urine-microalbumin',
    category: 'Urine Tests',
    name: 'Urine Microalbumin / Creatinine Ratio (ACR)',
    code: 'URN-04',
    description: 'Early detection of diabetic nephropathy and hypertensive microvascular damage.',
    fastingRequired: false,
    sampleType: 'Spot morning urine sample',
    turnaround: 'Same day (3 hours)'
  },

  // 3. X-Ray Diagnostic
  {
    id: 'xray-chest',
    category: 'X-Ray',
    name: 'Digital Chest X-Ray (PA View)',
    code: 'RAD-01',
    description: 'High-resolution digital radiography of lungs, mediastinum, pleura, and cardiac silhouette.',
    fastingRequired: false,
    sampleType: 'In-lab digital radiology suite',
    turnaround: 'Within 45 minutes',
    popular: true
  },
  {
    id: 'xray-spine',
    category: 'X-Ray',
    name: 'Spine Radiography (Cervical / Lumbar Spine AP & Lat)',
    code: 'RAD-02',
    description: 'Digital assessment of vertebral alignment, disc spaces, spondylosis, and postural curvature.',
    fastingRequired: false,
    sampleType: 'In-lab digital radiology suite',
    turnaround: 'Within 60 minutes'
  },
  {
    id: 'xray-joints',
    category: 'X-Ray',
    name: 'Extremities & Knee Joints (Bilateral Standing)',
    code: 'RAD-03',
    description: 'High-clarity skeletal views for joint space narrowing, osteoarthritis, fractures, and trauma evaluation.',
    fastingRequired: false,
    sampleType: 'In-lab digital radiology suite',
    turnaround: 'Within 45 minutes'
  },
  {
    id: 'xray-abdomen',
    category: 'X-Ray',
    name: 'Digital X-Ray Abdomen (KUB / Erect View)',
    code: 'RAD-04',
    description: 'Screening for radio-opaque renal calculi, bowel gas patterns, and abdominal calcifications.',
    fastingRequired: true,
    sampleType: 'In-lab digital radiology suite',
    turnaround: 'Within 60 minutes'
  },

  // 4. Related Diagnostics & Similar Tests
  {
    id: 'rel-ecg',
    category: 'Related Diagnostics',
    name: '12-Lead Digital ECG with Cardiologist Review',
    code: 'CRD-01',
    description: 'Continuous 12-channel electrocardiogram recorded on digital diagnostic machine with instant rhythm tracing.',
    fastingRequired: false,
    sampleType: 'In-clinic non-invasive electrode recording',
    turnaround: 'Immediate (20 minutes)',
    popular: true
  },
  {
    id: 'rel-dengue',
    category: 'Related Diagnostics',
    name: 'Dengue Serology Duo (NS1 Antigen + IgM/IgG)',
    code: 'IMM-09',
    description: 'Rapid and accurate differential diagnosis of early and late phase dengue viral infection.',
    fastingRequired: false,
    sampleType: 'Serum / Whole Blood',
    turnaround: 'Same day (2 hours)',
    popular: true
  },
  {
    id: 'rel-typhoid',
    category: 'Related Diagnostics',
    name: 'Widal Slide & Tube Test (Typhoid Serology)',
    code: 'MIC-05',
    description: 'Qualitative and quantitative antibody titre detection against Salmonella enterica serovars Typhi and Paratyphi.',
    fastingRequired: false,
    sampleType: 'Serum',
    turnaround: 'Same day (3 hours)'
  },
  {
    id: 'rel-stool',
    category: 'Related Diagnostics',
    name: 'Stool Routine & Occult Blood (FOBT)',
    code: 'CLI-02',
    description: 'Microscopic parasite detection and immunological fecal occult blood screening for gastrointestinal health.',
    fastingRequired: false,
    sampleType: 'Sterile stool sample container',
    turnaround: 'Same day (3 hours)'
  },

  // 5. Academic Certification & Technician Courses
  {
    id: 'course-basic-tech',
    category: 'Certification Courses',
    name: 'Certificate in Phlebotomy & Sample Accession',
    code: 'CRS-01',
    description: 'Hands-on practical training covering venipuncture techniques, vacutainer selection, barcode accessioning, and bio-safety protocols.',
    fastingRequired: false,
    sampleType: 'Practical lab batch training (Monthly enrollment)',
    turnaround: 'Monthly modules (Fee: Rs 1,500 per month)',
    popular: true
  },
  {
    id: 'course-intermediate',
    category: 'Certification Courses',
    name: 'Clinical Pathology & Hematology Technician Course',
    code: 'CRS-02',
    description: 'Comprehensive curriculum including automated CBC analyzer operation, slide preparation, Leishman staining, and quality control.',
    fastingRequired: false,
    sampleType: 'Hands-on clinical bench rotation',
    turnaround: 'Monthly modules (Fee: Rs 2,500 per month)'
  },
  {
    id: 'course-advanced',
    category: 'Certification Courses',
    name: 'Advanced Medical Diagnostic Technology & Biochemistry',
    code: 'CRS-03',
    description: 'In-depth mastery of clinical chemistry analyzers, ELISA readers, immunoassay calibrators, and diagnostic report verification.',
    fastingRequired: false,
    sampleType: 'Intensive clinical internship & mentoring',
    turnaround: 'Monthly modules (Fee: Rs 3,000 per month)',
    popular: true
  }
];
