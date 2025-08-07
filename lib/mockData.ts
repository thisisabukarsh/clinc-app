import { Doctor, Appointment, MedicalFile } from "@/types";

// Mock Doctors Data
export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "د. مريم عبد المعطي",
    specialty: "اخصائي نسائية",
    rating: 4.8,
    price: 20,
    currency: "دينار اردني",
    image: "",
    clinic: "عيادة الطيبة",
    location: "عمان",
    biography:
      "دكتورة مريم عبد المعطي متخصصة في أمراض النساء والتوليد مع خبرة تزيد عن 15 عاماً. تخرجت من كلية الطب في جامعة الأردن وتخصصت في أمراض النساء والتوليد. تهتم بالرعاية الشاملة للمرأة وتستخدم أحدث التقنيات الطبية.",
    experience: "15+ سنوات",
    education: "جامعة الأردن - كلية الطب",
  },
  {
    id: "2",
    name: "د. أحمد محمد",
    specialty: "اسنان",
    rating: 4.6,
    price: 15,
    currency: "دينار اردني",
    image: "",
    clinic: "عيادة الأسنان الحديثة",
    location: "عمان",
    biography:
      "دكتور أحمد محمد متخصص في طب الأسنان التجميلي والعلاجي. حاصل على شهادة البورد الأمريكي في طب الأسنان مع خبرة 12 عاماً.",
    experience: "12+ سنوات",
    education: "جامعة العلوم والتكنولوجيا",
  },
  {
    id: "3",
    name: "د. سارة خالد",
    specialty: "جلدية",
    rating: 4.9,
    price: 25,
    currency: "دينار اردني",
    image: "",
    clinic: "مركز الجلدية المتخصص",
    location: "الزرقاء",
    biography:
      "دكتورة سارة خالد متخصصة في الأمراض الجلدية والعلاج بالليزر. تخرجت من جامعة القاهرة وتخصصت في الأمراض الجلدية.",
    experience: "10+ سنوات",
    education: "جامعة القاهرة",
  },
  {
    id: "4",
    name: "د. عمر يوسف",
    specialty: "قلب",
    rating: 4.7,
    price: 30,
    currency: "دينار اردني",
    image: "",
    clinic: "مركز القلب المتخصص",
    location: "عمان",
    biography:
      "دكتور عمر يوسف متخصص في أمراض القلب والشرايين. حاصل على شهادة البورد الأوروبي في أمراض القلب.",
    experience: "18+ سنوات",
    education: "جامعة لندن",
  },
  {
    id: "5",
    name: "د. فاطمة علي",
    specialty: "اطفال",
    rating: 4.5,
    price: 18,
    currency: "دينار اردني",
    image: "",
    clinic: "عيادة الأطفال المتميزة",
    location: "اربد",
    biography:
      "دكتورة فاطمة علي متخصصة في طب الأطفال. تخرجت من جامعة العلوم والتكنولوجيا وتخصصت في طب الأطفال.",
    experience: "8+ سنوات",
    education: "جامعة العلوم والتكنولوجيا",
  },
  {
    id: "6",
    name: "د. خالد محمود",
    specialty: "عظام",
    rating: 4.4,
    price: 22,
    currency: "دينار اردني",
    image: "",
    clinic: "مركز العظام والعمود الفقري",
    location: "عمان",
    biography:
      "دكتور خالد محمود متخصص في جراحة العظام والعمود الفقري. حاصل على شهادة البورد الأمريكي في جراحة العظام.",
    experience: "14+ سنوات",
    education: "جامعة هارفارد",
  },
  {
    id: "7",
    name: "د. نورا سعد",
    specialty: "عيون",
    rating: 4.8,
    price: 28,
    currency: "دينار اردني",
    image: "",
    clinic: "مركز العيون المتخصص",
    location: "عمان",
    biography:
      "دكتورة نورا سعد متخصصة في طب العيون وجراحة الشبكية. تخرجت من جامعة الأردن وتخصصت في طب العيون.",
    experience: "11+ سنوات",
    education: "جامعة الأردن",
  },
  {
    id: "8",
    name: "د. محمد حسن",
    specialty: "اعصاب",
    rating: 4.6,
    price: 35,
    currency: "دينار اردني",
    image: "",
    clinic: "مركز الأعصاب المتخصص",
    location: "السلط",
    biography:
      "دكتور محمد حسن متخصص في طب الأعصاب وجراحة المخ والأعصاب. حاصل على شهادة البورد الألماني في طب الأعصاب.",
    experience: "16+ سنوات",
    education: "جامعة ميونخ",
  },
];

// Mock Appointments Data
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "د. مريم عبد المعطي",
    date: "2025-01-15",
    time: "02:34 مساءا",
    status: "upcoming",
  },
  {
    id: "2",
    doctorId: "2",
    doctorName: "د. أحمد محمد",
    date: "2025-01-17",
    time: "10:00 صباحا",
    status: "upcoming",
  },
  {
    id: "3",
    doctorId: "3",
    doctorName: "د. سارة خالد",
    date: "2025-01-10",
    time: "03:00 مساءا",
    status: "completed",
    medicalFile: {
      id: "1",
      appointmentId: "3",
      diagnosis: "التهاب بكتيري حاد في الحلق",
      notes: "تم إعطاء المريض إجازة يومين للراحة",
      prescription: [
        {
          id: "1",
          name: "مضاد حيوي (أموكسيسيلين 500 ملغ)",
          dosage: "كبسولة",
          frequency: "كل 8 ساعات",
          duration: "لمدة 7 أيام",
        },
        {
          id: "2",
          name: "مسكن للألم (باراسيتامول 500 ملغ)",
          dosage: "حسب الحاجة",
          frequency: "كل 6 ساعات",
          duration: "حسب الحاجة",
        },
      ],
      createdAt: "2025-01-10T15:00:00Z",
    },
  },
  {
    id: "4",
    doctorId: "4",
    doctorName: "د. عمر يوسف",
    date: "2025-01-05",
    time: "11:30 صباحا",
    status: "completed",
  },
];

// Mock Medical Files
export const mockMedicalFiles: MedicalFile[] = [
  {
    id: "1",
    appointmentId: "3",
    diagnosis: "التهاب بكتيري حاد في الحلق مع ارتفاع في درجة الحرارة",
    notes:
      "المريض يعاني من التهاب حاد في الحلق مع صعوبة في البلع. تم إعطاء المريض إجازة يومين للراحة وتجنب الأطعمة الحارة.",
    prescription: [
      {
        id: "1",
        name: "مضاد حيوي (أموكسيسيلين 500 ملغ)",
        dosage: "كبسولة",
        frequency: "كل 8 ساعات",
        duration: "لمدة 7 أيام",
      },
      {
        id: "2",
        name: "مسكن للألم (باراسيتامول 500 ملغ)",
        dosage: "حسب الحاجة",
        frequency: "كل 6 ساعات",
        duration: "حسب الحاجة",
      },
      {
        id: "3",
        name: "غسول فم مطهر",
        dosage: "مرتين يومياً",
        frequency: "صباحاً ومساءً",
        duration: "لمدة أسبوع",
      },
    ],
    createdAt: "2025-01-10T15:00:00Z",
  },
];

// Mock Time Slots Data
export const generateMockTimeSlots = (date: Date, _doctorId: string) => {
  const timeSlots = [
    { time: "09:00", available: true, price: 20 },
    { time: "09:30", available: false, price: 20 },
    { time: "10:00", available: true, price: 20 },
    { time: "10:30", available: true, price: 20 },
    { time: "11:00", available: false, price: 20 },
    { time: "11:30", available: true, price: 20 },
    { time: "14:00", available: true, price: 25 },
    { time: "14:30", available: true, price: 25 },
    { time: "15:00", available: false, price: 25 },
    { time: "15:30", available: true, price: 25 },
    { time: "16:00", available: true, price: 25 },
    { time: "16:30", available: true, price: 25 },
    { time: "17:00", available: false, price: 25 },
    { time: "17:30", available: true, price: 25 },
  ];

  // Randomly disable some slots for different dates
  const dayOfWeek = date.getDay();
  const randomFactor = dayOfWeek % 3;

  return timeSlots.map((slot, index) => ({
    ...slot,
    available: slot.available && (index + randomFactor) % 4 !== 0,
  }));
};

export const medicalSpecialties = [
  {
    id: "1",
    name: "Dermatology",
    nameAr: "عيادة جلدية",
    iconUrl: "/icon.png",
    slug: "dermatology",
  },
  {
    id: "2",
    name: "Dentistry",
    nameAr: "عيادة اسنان",
    iconUrl: "/icon.png",
    slug: "dentistry",
  },
  {
    id: "3",
    name: "Internal Medicine",
    nameAr: "عيادة باطنية",
    iconUrl: "/icon.png",
    slug: "internal-medicine",
  },
  {
    id: "4",
    name: "Cardiology",
    nameAr: "عيادة قلبية",
    iconUrl: "/icon.png",
    slug: "cardiology",
  },
  {
    id: "5",
    name: "Ear, Nose & Throat",
    nameAr: "عيادة أذن وحنجرة",
    iconUrl: "/icon.png",
    slug: "ent",
  },
  {
    id: "6",
    name: "Orthopedics",
    nameAr: "عيادة عظام",
    iconUrl: "/icon.png",
    slug: "orthopedics",
  },
  {
    id: "7",
    name: "Neurology",
    nameAr: "عيادة عصبية",
    iconUrl: "/icon.png",
    slug: "neurology",
  },
  {
    id: "8",
    name: "Ophthalmology",
    nameAr: "عيادة عيون",
    iconUrl: "/icon.png",
    slug: "ophthalmology",
  },
  {
    id: "9",
    name: "Pediatrics",
    nameAr: "عيادة أطفال",
    iconUrl: "/icon.png",
    slug: "pediatrics",
  },
  {
    id: "10",
    name: "Gynecology",
    nameAr: "عيادة نسائية",
    iconUrl: "/icon.png",
    slug: "gynecology",
  },
];
