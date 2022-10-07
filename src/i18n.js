import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      login: "Log in",
      signup: "Sign up",
      open_design: "Open account to DESIGN",
      open_sell: "Open account to SELL",
      open_buy: "Open account to BUY / INSTALL",
      content_summary_title: "Digital transformation of renewable<br></br> energy industry for a worldwide<br></br> access to electricity",
      summary_point1: "Get the most cost-effective<br></br> design in minutes",
      summary_point2: "Compare different technologies,<br></br> manufacturers and designs",
      summary_point3: "Purchase your hardware and<br></br> material at better price",
      summary_point4: "Offer your products in projects that are<br></br> being developed at the moment<br></br>by your customers",
      summary_point5: "Give power to the vulnerable<br></br> communities with every project<br></br> you develop",
      content_details_title: "Why this is the unique and only Marketplace<br></br> and PV Design Platform?",
      content_subtitle1: "Design Optimization in minutes",
      detail_point1: "Our AI algorithms allow designers to iterate hundreds of designs in minutes to provide the most cost-effective solution for you and your customers",
      content_subtitle2: "Give power to communites with no electricity",
      detail_point2: "For every $2 we receive from your purchases, we use $1 to build renewable energy systems for people with no access to electricity",
      content_subtitle3: "Offer your products in projects being developed right now",
      detail_point3: "Get in track of the developers, designers, and engineers from the initial stages of the projects",
      content_subtitle4: "Compare different technologies, manufacturers and designs",
      detail_point4: "Create quick design for net-metering, grid-tie with backup, microgrids, off-grid etc, considering the top technologies in the industry, top tiered manufacturers and local suppliers",
      content_subtitle5: "Purchase your hardware and material at better price",
      detail_point5: "Access the best marketplace for renewable energy products, with the same manufacturers and suppliers you have been working with",
      content_subtitle6: "Digitalize your design, engineering, permits and procurement process",
      detail_point6: "Generate engineering drawings (site plans, single lines), BOM, technical specifications and design reports to save hours in these processes",
      username: "USERNAME",
      password: "PASSWORD",
      corporate_email: "Type your corporate email",
      enter_password: "Enter your password",
      password_min: "* Password should be a minimum of 8 characters",
      forgot_password: "Forgot Password",
      login_google: "Login with Google Account",
      create_designer: "Create Designer Account",
      create_supplier: "Create Supplier Account",
      create_buyer: "Create Buyer/Installer Account",
      search_products_header: "Search for Products",
      create: "CREATE",
      projects: "Projects",
      in_progress: "In Progress",
      completed: "Completed",
      on_hold: "On Hold",
      catalogue: "Catalogue",
      inhouse_products: "In-house Products",
      external_products: "External Products",
      electricity_rates: "Electricity Rates",
      custom_rates: "Custom Rates",
      existing_rates: "Existing Rates",
      load_profiles: "Load Profiles",
      custom_load_profiles: "Custom Load Profiles",
      existing_load_profiles: "Existing Load Profiles",
      incentives: "Incentives",
      search_projects: "Search projects",
      add_filter: "ADD FILTER",
      type: "Type",
      project_name: "Project Name",
      address: "Address",
      contact: "Contact",
      stage: "Stage",
      actions: "Actions",
      create_new_project: "CREATE NEW PROJECT"
    }
  },
  es: {
    translation: {
      login: "iniciar sesión",
      signup: "Registrarse",
      open_design: "Abrir cuenta para DISEÑAR",
      open_sell: "Abrir cuenta para VENDER",
      open_buy: "Abrir cuenta para INSTALAR",
      content_summary_title: "La Transformación digital de la industria<br></br> de energías renovables...<br></br> por un acceso mundial a la electricidad!",
      summary_point1: "Obten el diseño con mayor<br></br> Costo-Benefico en cuestión de minutos",
      summary_point2: "Compara diferentes tecnologias,<br></br> fabricantes y soluciones",
      summary_point3: "Compra tus equipos y materiales al<br></br> mejor precio",
      summary_point4: "Ofrece tus productos en los proyectos<br></br> que tus clientes están desarrollando",
      summary_point5: "Brinda electricidad a comunidades<br></br> vulnerables, con cada proyecto que<br></br> desarrollas",
      content_details_title: "Por qué esta es la mejor plataforma de Diseño y único<br></br> Marketplace para energías renovables?",
      content_subtitle1: "Optimización de Diseño en minutos",
      detail_point1: "Nuestros algoritmos con Inteligencia Artificial (AI) permiten a los diseñadores iterar cientos de diseños en minutos para encountrar la solución con mayor costo-beneficio para los clientes",
      content_subtitle2: "Entrega  energía a comunidades sin acceso a electricidad",
      detail_point2: "Por cada $2 dólares que recibimos a partir de tus compras invertimos $1 para construir sistemas con energía renovables para personas sin acceso a electricidad",
      content_subtitle3: "Ofrece tus productos  en proyectos que se están desarrollando actualmente",
      detail_point3: "Ubicate en el radar de los desarrollandores, diseñadores e ingenieros desde el comienzo de los proyectos",
      content_subtitle4: "Compara diferentes technologías, fabricantes y diseños",
      detail_point4: "Crea rápidos diseños para medición neta, sistemas hibridos conectados a la red, micro-redes, aislados de la red, teniendo en cuenta las mejores technologías en la industria y los proveedores locales más confiables",
      content_subtitle5: "Compra tus equipos y materiales a un mejor precio",
      detail_point5: "Accede al mejor Marketplace para productos de energía renovable, con los fabricantes y proveedores de tu preferencia",
      content_subtitle6: "Digitaliza tus procesos de diseño, ingeniería, permisos y suministro",
      detail_point6: "Ahorra horas de trabajo en estos procesos, y genera planos, diagramas unifilares, listado de materiales, especificaciones técnicas y reportes de diseño en minutos",
      username: "USUARIO",
      password: "CONTRASEÑA",
      corporate_email: "Ingresa tu email corporativo",
      enter_password: "Entra tu contraseña",
      password_min: "* La contraseña debe tener un mínimo de 8 caracteres",
      forgot_password: "Olvidé mi Contraseña?",
      login_google: "Iniciar sesión con cuenta de Google",
      create_designer: "Crear cuenta de Diseñador",
      create_supplier: "Crear cuenta de Proveedor",
      create_buyer: "Crear cuenta de Comprador/Instalador",
      search_products_header: "Buscar productos",
      create: "CREAR",
      projects: "Projectos",
      in_progress: "En Desarrollo",
      completed: "Terminados",
      on_hold: "Pendientes",
      catalogue: "Catalogo",
      inhouse_products: "Productos en Bodega",
      external_products: "Productos del mercado",
      electricity_rates: "Tarifas de electricidad",
      custom_rates: "Mis tarifas",
      existing_rates: "Tarifas Existentes",
      load_profiles: "Perfiles de Consumo",
      custom_load_profiles: "Mis perfiles de consumo",
      existing_load_profiles: "Perfiles existentes",
      incentives: "Incentivos",
      search_projects: "Buscar proyectos",
      add_filter: "FILTRAR POR",
      type: "Categoría",
      project_name: "Nombre del Proyecto",
      address: "Ubicación",
      contact: "Contacto",
      stage: "Etapa",
      actions: "Acciones",
      create_new_project: "CREAR UN NUEVO PROYECTO"
      
    }
  }
};

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage']
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    detection: DETECTION_OPTIONS,
    resources,
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

  export default i18n;