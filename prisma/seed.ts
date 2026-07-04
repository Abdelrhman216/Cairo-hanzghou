import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import {
  destinations as defaultDestinations,
  packages as defaultPackages,
  hotels as defaultHotels,
  flightRoutes as defaultFlights,
  stats as defaultStats,
  testimonials as defaultTestimonials,
  homeShortcuts as defaultHomeShortcuts,
  navItems as defaultNavItems,
  adminNavItems as defaultAdminNavItems,
} from "../src/lib/data";
import { SERVICE_CATEGORIES as defaultServices } from "../src/lib/config/services";
import { COUNTRIES as defaultCountries } from "../src/lib/config/countries";
import { VISA_DATABASE, DOCUMENT_REGISTRY } from "../src/lib/visa-database";

// Load environment variables manually
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    const match = envFile.match(/^DATABASE_URL=["']?([^"\n\r']+)["']?/m);
    if (match) {
      databaseUrl = match[1];
    }
  } catch (e) {}
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Clear Database
  await prisma.userSession.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.localizedContent.deleteMany();
  await prisma.language.deleteMany();
  await prisma.cmsCollectionItem.deleteMany();
  await prisma.cmsSetting.deleteMany();
  await prisma.visaTypeDocument.deleteMany();
  await prisma.visaDocument.deleteMany();
  await prisma.visaType.deleteMany();
  await prisma.country.deleteMany();
  await prisma.visaApplication.deleteMany();
  await prisma.adminNotification.deleteMany();

  console.log("Database cleared.");

  // 2. Seed Languages
  await prisma.language.createMany({
    data: [
      { code: "en", name: "English", dir: "ltr" },
      { code: "ar", name: "العربية", dir: "rtl" },
    ],
  });
  console.log("Languages seeded.");

  // 3. Seed Roles & Permissions
  const roles = [
    { id: "role-superadmin", name: "Super Admin", description: "Full system access & security config" },
    { id: "role-admin", name: "Admin", description: "Administrative portal management" },
    { id: "role-manager", name: "Manager", description: "Team management & reporting tools" },
    { id: "role-employee", name: "Employee", description: "Assigned applications handling" },
    { id: "role-customer", name: "Customer", description: "Standard traveler client access" },
  ];

  const permissions = [
    { id: "perm-admin-access", code: "admin.access", description: "Access Admin Dashboard UI" },
    { id: "perm-users-read", code: "users.read", description: "View user listings" },
    { id: "perm-users-create", code: "users.create", description: "Create user accounts" },
    { id: "perm-users-update", code: "users.update", description: "Edit user roles/statuses" },
    { id: "perm-users-delete", code: "users.delete", description: "Delete user accounts" },
    { id: "perm-visa-read", code: "visa.read", description: "View visa requests" },
    { id: "perm-visa-create", code: "visa.create", description: "Submit visa requests" },
    { id: "perm-visa-update", code: "visa.update", description: "Update visa states/checklist rules" },
    { id: "perm-visa-delete", code: "visa.delete", description: "Remove visa applications" },
    { id: "perm-packages-manage", code: "packages.manage", description: "Manage tour packages" },
    { id: "perm-payments-read", code: "payments.read", description: "Access payments & financial metrics" },
    { id: "perm-settings-manage", code: "settings.manage", description: "Configure system rules" },
    { id: "perm-support-manage", code: "support.manage", description: "Handle customer queries & support chats" },
    { id: "perm-campaigns-manage", code: "campaigns.manage", description: "Create and publish alerts/promos" },
    { id: "perm-reports-read", code: "reports.read", description: "View dashboard widgets & statistics reports" },
    { id: "perm-role-manage", code: "role.manage", description: "Configure role/permission controls" },
    { id: "perm-customer-access", code: "customer.access", description: "Standard client dashboard access" },
  ];

  await prisma.role.createMany({ data: roles });
  await prisma.permission.createMany({ data: permissions });

  // Map permissions to roles
  const superAdminPerms = permissions.map((p) => ({ roleId: "role-superadmin", permissionId: p.id }));
  const adminPerms = permissions
    .filter((p) => !["users.delete", "role.manage"].includes(p.code))
    .map((p) => ({ roleId: "role-admin", permissionId: p.id }));
  const managerPerms = permissions
    .filter((p) => ["admin.access", "users.read", "visa.read", "visa.update", "support.manage", "reports.read"].includes(p.code))
    .map((p) => ({ roleId: "role-manager", permissionId: p.id }));
  const employeePerms = permissions
    .filter((p) => ["admin.access", "visa.read", "visa.update"].includes(p.code))
    .map((p) => ({ roleId: "role-employee", permissionId: p.id }));
  const customerPerms = [
    { roleId: "role-customer", permissionId: "perm-customer-access" },
    { roleId: "role-customer", permissionId: "perm-visa-create" },
  ];

  await prisma.rolePermission.createMany({
    data: [...superAdminPerms, ...adminPerms, ...managerPerms, ...employeePerms, ...customerPerms],
  });
  console.log("Roles and permissions mapping completed.");

  // 4. Seed Standard User Accounts
  const users = [
    { id: "USR-001", name: "Super Administrator", email: "superadmin@cairohangzhou.com", passwordHash: "password123", status: "active", joinedDate: "Jan 2025" },
    { id: "USR-002", name: "Admin Assistant", email: "admin@cairohangzhou.com", passwordHash: "password123", status: "active", joinedDate: "Feb 2025" },
    { id: "USR-003", name: "Regional Manager", email: "manager@cairohangzhou.com", passwordHash: "password123", status: "active", joinedDate: "Mar 2025" },
    { id: "USR-004", name: "Visa Clerk", email: "employee@cairohangzhou.com", passwordHash: "password123", status: "active", joinedDate: "Apr 2025" },
    { id: "USR-005", name: "Ahmed Al-Hassan", email: "customer@cairohangzhou.com", passwordHash: "password123", status: "active", joinedDate: "May 2025" },
  ];

  await prisma.user.createMany({ data: users });

  const userRoles = [
    { userId: "USR-001", roleId: "role-superadmin" },
    { userId: "USR-002", roleId: "role-admin" },
    { userId: "USR-003", roleId: "role-manager" },
    { userId: "USR-004", roleId: "role-employee" },
    { userId: "USR-005", roleId: "role-customer" },
  ];
  await prisma.userRole.createMany({ data: userRoles });
  console.log("Seed users added.");

  // 5. Seed CMS Collection Items (Generic Store)
  const collections: Record<string, any[]> = {
    destinations: defaultDestinations,
    packages: defaultPackages,
    hotels: defaultHotels,
    flights: defaultFlights,
    stats: defaultStats,
    testimonials: defaultTestimonials,
    homeShortcuts: defaultHomeShortcuts,
    navigation: defaultNavItems,
    adminNavigation: defaultAdminNavItems,
    services: defaultServices,
    countries: defaultCountries,
    faqs: [
      {
        id: "visa-processing-time",
        question: "How long does visa processing take?",
        answer: "Processing time depends on the destination and visa type. Most supported tourist visas take between 3 and 15 business days.",
        category: "Visa",
        published: true,
      },
      {
        id: "custom-packages",
        question: "Can Cairo Hangzhou build a custom travel package?",
        answer: "Yes. Advisors can build custom flights, hotels, transfers, tours, and visa support for individual travelers, families, and companies.",
        category: "Packages",
        published: true,
      },
    ],
    blogs: [
      {
        id: "post-schengen-guide",
        title: "Schengen Visa Guide: 10 Common Mistakes to Avoid",
        slug: "post-schengen-guide",
        excerpt: "A practical checklist for preparing complete visa applications.",
        body: "Keep passport validity, proof of funds, accommodation, flight itinerary, travel insurance, and employment or enrollment evidence ready before applying.",
        published: true,
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  };

  for (const [colName, list] of Object.entries(collections)) {
    const dataItems = list.map((item) => ({
      id: item.id || undefined,
      collection: colName,
      data: item,
    }));
    await prisma.cmsCollectionItem.createMany({ data: dataItems });
  }
  console.log("CMS Collections seeded.");

  // 6. Seed CMS Global Settings
  const settings = {
    company: {
      name: "Cairo Hangzhou",
      tagline: "Visa & Travel Services",
      email: "info@cairohangzhou.com",
      phone: "+20 123 456 7890",
      website: "https://cairohangzhou.com",
    },
    home: {
      heroTitle: "Travel Without Borders",
      heroSubtitle: "Premium visa, flight, hotel, and tour services backed by expert advisors.",
      heroImage: "/hero.png",
      promiseCards: [
        { id: "approval", icon: "verified", title: "Guaranteed Visa Approval", desc: "99.2% success rate across 195+ countries with dedicated document support" },
        { id: "reach", icon: "public", title: "Truly Global Reach", desc: "Offices, partners, and expertise in every major continent" },
        { id: "service", icon: "workspace_premium", title: "White-Glove Service", desc: "24/7 concierge available throughout your journey, anywhere in the world" },
        { id: "insured", icon: "security", title: "Trusted & Insured", desc: "Fully licensed with comprehensive travel protection for all destinations" },
      ],
    },
    footer: {
      tagline: "Curating bespoke journeys between the majestic heritage of the Nile and the poetic serenity of the West Lake.",
    },
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.cmsSetting.create({
      data: { key, value },
    });
  }
  console.log("CMS Global Settings seeded.");

  // 7. Seed Relational Visa Countries, Types & Requirements
  for (const country of VISA_DATABASE) {
    await prisma.country.create({
      data: {
        countryCode: country.countryCode,
        countryName: country.countryName,
        flag: country.flag,
        embassyUrl: country.embassyUrl || "",
        continent: country.continent,
        capital: country.capital || "",
        currency: country.currency || "",
        visaFreeForEgyptian: country.visaFreeForEgyptian ?? false,
      },
    });

    for (const vt of country.visaTypes) {
      const createdType = await prisma.visaType.create({
        data: {
          id: `${country.countryCode}::${vt.id}`, // Unique ID structure
          countryCode: country.countryCode,
          label: vt.label,
          description: vt.description,
          icon: vt.icon,
          processingTime: vt.processingTime,
          governmentFee: vt.governmentFee || "",
          maxStay: vt.maxStay || "",
          validity: vt.validity || "",
          eVisa: vt.eVisa ?? false,
          visaOnArrival: vt.visaOnArrival ?? false,
        },
      });

      // Map document requirements
      for (const doc of vt.requiredDocuments) {
        if (!doc || !doc.id) {
          console.warn(`WARNING: Undefined document found in visa type "${vt.label}" (Country: ${country.countryName}). Skipping.`);
          continue;
        }
        // Upsert Document in registry
        await prisma.visaDocument.upsert({
          where: { id: doc.id },
          update: {},
          create: {
            id: doc.id,
            label: doc.label,
            description: doc.description,
            required: doc.required ?? true,
            sampleUrl: doc.sampleUrl || null,
          },
        });

        // Link visa type and document
        await prisma.visaTypeDocument.create({
          data: {
            visaTypeId: createdType.id,
            documentId: doc.id,
          },
        });
      }
    }
  }
  console.log("Visa rules database seeding finished.");

  // 8. Seed Localized Translations (Example Arabic matches)
  const translations = [
    // Dubai Marina
    { entityType: "destination", entityId: "dubai-marina", fieldName: "name", locale: "ar", content: "مرسى دبي" },
    { entityType: "destination", entityId: "dubai-marina", fieldName: "location", locale: "ar", content: "دبي، الإمارات العربية المتحدة" },
    { entityType: "destination", entityId: "dubai-marina", fieldName: "category", locale: "ar", content: "عصري" },
    { entityType: "destination", entityId: "dubai-marina", fieldName: "description", locale: "ar", content: "أفق حديث، تجارب تسوق عالمية، وأفخم الفنادق والمنتجعات الصحراوية." },

    // Kyoto Temples
    { entityType: "destination", entityId: "kyoto-temples", fieldName: "name", locale: "ar", content: "معابد كيوتو" },
    { entityType: "destination", entityId: "kyoto-temples", fieldName: "location", locale: "ar", content: "كيوتو، اليابان" },
    { entityType: "destination", entityId: "kyoto-temples", fieldName: "category", locale: "ar", content: "ثقافي" },
    { entityType: "destination", entityId: "kyoto-temples", fieldName: "description", locale: "ar", content: "تجول عبر قرون من تاريخ الساموراي، الأجنحة الذهبية، وأشجار الكرز الفاتنة." },

    // Santorini Caldera
    { entityType: "destination", entityId: "santorini-caldera", fieldName: "name", locale: "ar", content: "كالديرا سانتوريني" },
    { entityType: "destination", entityId: "santorini-caldera", fieldName: "location", locale: "ar", content: "سانتوريني، اليونان" },
    { entityType: "destination", entityId: "santorini-caldera", fieldName: "category", locale: "ar", content: "فاخر" },
    { entityType: "destination", entityId: "santorini-caldera", fieldName: "description", locale: "ar", content: "مشاهد قباب زرقاء أيقونية وغروب شمس بركاني فوق مياه بحر إيجة الساحرة." },

    // West Lake Hangzhou
    { entityType: "destination", entityId: "west-lake-hangzhou", fieldName: "name", locale: "ar", content: "بحيرة هانغتشو الغربية" },
    { entityType: "destination", entityId: "west-lake-hangzhou", fieldName: "location", locale: "ar", content: "هانغتشو، الصين" },
    { entityType: "destination", entityId: "west-lake-hangzhou", fieldName: "category", locale: "ar", content: "طبيعة" },
    { entityType: "destination", entityId: "west-lake-hangzhou", fieldName: "description", locale: "ar", content: "انغمس في الجمال الهادئ لأجنحة البحيرة الغربية الضبابية وحقول الشاي الأخضر الحريرية." },

    // Giza Necropolis
    { entityType: "destination", entityId: "giza-necropolis", fieldName: "name", locale: "ar", content: "أهرامات الجيزة" },
    { entityType: "destination", entityId: "giza-necropolis", fieldName: "location", locale: "ar", content: "القاهرة، مصر" },
    { entityType: "destination", entityId: "giza-necropolis", fieldName: "category", locale: "ar", content: "حصري" },
    { entityType: "destination", entityId: "giza-necropolis", fieldName: "description", locale: "ar", content: "شاهد الأثر الأخير المتبقي من عجائب الدنيا السبع القديمة في عظمة تأخذ الأنفاس." },

    // Maldives Overwater
    { entityType: "destination", entityId: "maldives-atoll", fieldName: "name", locale: "ar", content: "منتجعات جزر المالديف" },
    { entityType: "destination", entityId: "maldives-atoll", fieldName: "location", locale: "ar", content: "شمال مالي أتول، جزر المالديف" },
    { entityType: "destination", entityId: "maldives-atoll", fieldName: "category", locale: "ar", content: "هدوء" },
    { entityType: "destination", entityId: "maldives-atoll", fieldName: "description", locale: "ar", content: "بحيرات شاطئية كريستالية، أكواخ فوق الماء، وهدوء تام في قلب المحيط الهندي." },
  ];

  for (const t of translations) {
    await prisma.localizedContent.create({ data: t });
  }
  console.log("Translations seeded.");

  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
