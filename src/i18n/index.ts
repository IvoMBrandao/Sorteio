import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const en = {
  // HEADER TITLES
  "header": { "title": "Draw" },
  
  // NAMES SECTION
  "names": {
    "header": { "title": "Names", "subtitle": "Manage your name lists" },
    "import": {
      "alertTitle": "Multiple names detected",
      "alertMessage": "Found {{count}} names. What would you like to do?",
      "addIndividual": "Add individually",
      "createList": "Create list",
      "listDetected": "List detected (use comma or line break)",
      "placeholder": "Add a name...",
      "helper": "Tip: Use commas or line breaks to add multiple names at once",
      "listCreated": "List '{{name}}' created successfully"
    },
    "importModal": {
      "title": "Import Names",
      "howToTitle": "How to import",
      "instruction": "Enter names separated by commas or line breaks",
      "inputLabel": "Names",
      "placeholder": "John, Maria, Carlos...",
      "button": "Import Names"
    },
    "list": {
      "countTitle": "{{count}} names",
      "clearAllButton": "Clear all",
      "clearAllTitle": "Clear all names",
      "clearAllDesc": "This will remove all names from the list. This action cannot be undone.",
      "clearAllConfirm": "Clear all",
      "removeConfirmTitle": "Remove name",
      "removeConfirmDesc": "Remove '{{name}}' from the list?",
      "emptyTitle": "No names added yet",
      "emptySubtitle": "Add names using the field above",
      "clearTitle": "Clear all names", // Para tela de configurações
      "clearMessage": "Are you sure you want to remove all names? This action cannot be undone."
    },
    "savedLists": {
      "sectionTitle": "Saved lists ({{count}})",
      "namesCount": "{{count}} names",
      "useButton": "Use",
      "deleteAlertTitle": "Delete list",
      "deleteAlertMsg": "Delete '{{title}}'?",
      "loadAlertTitle": "Use list",
      "loadAlertMsg": "Add all names from '{{title}}' to the current list?",
      "addAction": "Add names"
    },
    "saveModal": {
      "title": "Save list",
      "subtitle": "{{count}} names to save",
      "placeholder": "List name...",
      "saveButton": "Save"
    },
    "editModal": {
      "title": "Edit list",
      "listNameLabel": "List name",
      "membersLabel": "Members",
      "addPlaceholder": "New name...",
      "saveButton": "Save changes"
    }
  },

  // DRAW SECTION
  "sortear": {
    "header": { "title": "Draw", "subtitle": "Choose the type of draw you want to perform" },
    "cards": {
      "namesTitle": "Name Draw", 
      "namesDescription": "Draw names from your saved list",
      "numbersTitle": "Number Draw", 
      "numbersDescription": "Draw numbers in a range",
      "sequenceTitle": "Number Sequence", 
      "sequenceDescription": "Generate a sequence of numbers",
      "groupsTitle": "Group Draw", 
      "groupsDescription": "Distribute participants into groups"
    },
    
    // Para as telas individuais (títulos dos cards)
    "names": {
      "title": "Name Draw",
      "description": "Draw names from your saved list"
    },
    "numbers": {
      "title": "Number Draw",
      "description": "Draw numbers in a range"
    },
    "sequence": {
      "title": "Number Sequence",
      "description": "Generate a sequence of numbers"
    },
    "groups": {
      "title": "Group Draw",
      "description": "Distribute participants into groups",
      "button": "Draw Groups"
    },
    
    // Names Lottery Form
    "namesForm": {
      "sourceTitle": "Who will participate?",
      "looseNames": "Loose Names",
      "namesCount": "{{count}} names",
      "configTitle": "Settings",
      "allowRepetition": "Allow repetition",
      "quantityLabel": "Number of winners",
      "emptyListWarning": "The selected list is empty",
      "displayTitle": "Result display",
      "sequentialLabel": "Sequential reveal",
      "sequentialSublabel": "Creates suspense",
      "intervalLabel": "Seconds between items",
      "reverseLabel": "Reverse order",
      "reverseSublabel": "Start from last (ideal for podiums)",
      "previewTitle": "Preview ({{count}} names)",
      "moreNames": "+ {{count}} more",
      "noNamesFound": "No names found",
      "submitButton": "Draw Names"
    },
    
    // Numbers Lottery Form
    "numbersForm": {
      "rangeTitle": "Number range",
      "minLabel": "Minimum",
      "maxLabel": "Maximum",
      "configTitle": "Settings",
      "allowRepetition": "Allow repetition",
      "quantityLabel": "Quantity",
      "rangeWarning": "Maximum {{range}} numbers without repetition",
      "sequentialLabel": "Sequential reveal",
      "intervalLabel": "Interval (seconds)",
      "reverseLabel": "Reverse order",
      "submitButton": "Draw Numbers"
    },
    
    // Sequence Form
    "sequenceForm": {
      "rangeTitle": "Number range",
      "minLabel": "Minimum",
      "maxLabel": "Maximum",
      "configTitle": "Settings",
      "allowRepetition": "Allow repetition",
      "quantityLabel": "Sequence length",
      "rangeWarning": "Maximum {{range}} numbers without repetition",
      "submitButton": "Generate Sequence"
    },
    
    // Groups Lottery Form (renomeado para evitar conflito)
    "groupsForm": {
      "sourceTitle": "Source",
      "looseNames": "Loose Names",
      "peopleCount": "{{count}} people",
      "configTitle": "Configuration",
      "membersLabel": "Members per group",
      "distributeEvenly": "Distribute evenly",
      "distributeSub": "Like dealing cards",
      "infoTotal": "{{total}} people → {{groups}} groups",
      "infoRemainder": "Last group with {{count}} members",
      "infoPerfect": "All groups will have the same number of members",
      "emptyWarning": "No participants available",
      "button": "Draw Groups"
    },
    
    // Groups Result Modal
    "groupsResult": {
      "title": "Groups Drawn",
      "statusSorting": "Forming groups...",
      "statusFinished": "Groups ready!",
      "groupLabel": "Group",
      "waiting": "Waiting for members...",
      "drawAgain": "Draw new groups"
    },
    
    // Result Modal geral
    "modal": {
      "resultTitle": "Draw Result",
      "drawAgain": "Draw again"
    },
    
    // Result Modal para nomes/números
    "result": {
      "numbersTitle": "Numbers Drawn",
      "namesTitle": "Names Drawn",
      "defaultTitle": "Draw Result",
      "drawAgain": "Draw again"
    }
  },

  // COMMON
  "common": {
    "success": "Success",
    "cancel": "Cancel",
    "delete": "Delete",
    "remove": "Remove",
    "save": "Save",
    "wait": "Wait...",
    "sorting": "Sorting...",
    "drawAgain": "Draw again",
    "confirm": "Confirm",
    "add": "Add",
    "close": "Close",
    "edit": "Edit",
    "create": "Create",
    "import": "Import",
    "clear": "Clear"
  },

  // SETTINGS
  "settings": {
    "header": {
      "title": "Settings",
      "subtitle": "Customize your experience"
    },
    "sections": {
      "appearance": "Appearance",
      "language": "Language",
      "data": "Data",
      "about": "About"
    },
    "items": {
      "theme": { 
        "title": "Theme",
        "dark": "Dark",
        "light": "Light"
      },
      "language": { 
        "title": "Language",
        "portuguese": "Portuguese",
        "english": "English"
      },
      "clearNames": {
        "title": "Clear all names",
        "description": "Remove all names from the current list"
      },
      "resetHistory": {
        "title": "Reset history",
        "description": "Clear all draw history"
      },
      "appInfo": {
        "title": "App information",
        "description": "Version 1.0.0"
      }
    }
  }
};

const pt = {
  // HEADER TITLES
  "header": { "title": "Sortear" },
  
  // NAMES SECTION
  "names": {
    "header": { "title": "Nomes", "subtitle": "Gerencie suas listas de nomes" },
    "import": {
      "alertTitle": "Múltiplos nomes detectados",
      "alertMessage": "Encontramos {{count}} nomes. O que você deseja fazer?",
      "addIndividual": "Adicionar individualmente",
      "createList": "Criar lista",
      "listDetected": "Lista detectada (use vírgula ou quebra de linha)",
      "placeholder": "Adicionar um nome...",
      "helper": "Dica: Use vírgulas ou quebras de linha para adicionar vários nomes de uma vez",
      "listCreated": "Lista '{{name}}' criada com sucesso"
    },
    "importModal": {
      "title": "Importar Nomes",
      "howToTitle": "Como importar",
      "instruction": "Digite os nomes separados por vírgulas ou quebras de linha",
      "inputLabel": "Nomes",
      "placeholder": "João, Maria, Carlos...",
      "button": "Importar Nomes"
    },
    "list": {
      "countTitle": "{{count}} nomes",
      "clearAllButton": "Limpar tudo",
      "clearAllTitle": "Limpar todos os nomes",
      "clearAllDesc": "Isso removerá todos os nomes da lista. Esta ação não pode ser desfeita.",
      "clearAllConfirm": "Limpar tudo",
      "removeConfirmTitle": "Remover nome",
      "removeConfirmDesc": "Remover '{{name}}' da lista?",
      "emptyTitle": "Nenhum nome adicionado ainda",
      "emptySubtitle": "Adicione nomes usando o campo acima",
      "clearTitle": "Limpar todos os nomes", // Para tela de configurações
      "clearMessage": "Tem certeza que deseja remover todos os nomes? Esta ação não pode ser desfeita."
    },
    "savedLists": {
      "sectionTitle": "Listas salvas ({{count}})",
      "namesCount": "{{count}} nomes",
      "useButton": "Usar",
      "deleteAlertTitle": "Excluir lista",
      "deleteAlertMsg": "Excluir '{{title}}'?",
      "loadAlertTitle": "Usar lista",
      "loadAlertMsg": "Adicionar todos os nomes de '{{title}}' à lista atual?",
      "addAction": "Adicionar nomes"
    },
    "saveModal": {
      "title": "Salvar lista",
      "subtitle": "{{count}} nomes para salvar",
      "placeholder": "Nome da lista...",
      "saveButton": "Salvar"
    },
    "editModal": {
      "title": "Editar lista",
      "listNameLabel": "Nome da lista",
      "membersLabel": "Membros",
      "addPlaceholder": "Novo nome...",
      "saveButton": "Salvar alterações"
    }
  },

  // DRAW SECTION
  "sortear": {
    "header": { "title": "Sortear", "subtitle": "Escolha o tipo de sorteio que deseja realizar" },
    "cards": {
      "namesTitle": "Sorteio de Nomes", 
      "namesDescription": "Sorteie nomes da sua lista salva",
      "numbersTitle": "Sorteio de Números", 
      "numbersDescription": "Sorteie números em um intervalo",
      "sequenceTitle": "Sequência de Números", 
      "sequenceDescription": "Gere uma sequência de números",
      "groupsTitle": "Sorteio de Grupos", 
      "groupsDescription": "Distribua participantes em grupos"
    },
    
    // Para as telas individuais (títulos dos cards)
    "names": {
      "title": "Sorteio de Nomes",
      "description": "Sorteie nomes da sua lista salva"
    },
    "numbers": {
      "title": "Sorteio de Números",
      "description": "Sorteie números em um intervalo"
    },
    "sequence": {
      "title": "Sequência de Números",
      "description": "Gere uma sequência de números"
    },
    "groups": {
      "title": "Sorteio de Grupos",
      "description": "Distribua participantes em grupos",
      "button": "Sortear Grupos"
    },
    
    // Names Lottery Form
    "namesForm": {
      "sourceTitle": "Quem vai participar?",
      "looseNames": "Nomes Avulsos",
      "namesCount": "{{count}} nomes",
      "configTitle": "Configurações",
      "allowRepetition": "Permitir repetição",
      "quantityLabel": "Quantidade de sorteados",
      "emptyListWarning": "A lista selecionada está vazia",
      "displayTitle": "Exibição do resultado",
      "sequentialLabel": "Revelação sequencial",
      "sequentialSublabel": "Cria suspense no resultado",
      "intervalLabel": "Segundos entre itens",
      "reverseLabel": "Ordem inversa",
      "reverseSublabel": "Começar do último (ideal para pódios)",
      "previewTitle": "Prévia ({{count}} nomes)",
      "moreNames": "+ {{count}} outros",
      "noNamesFound": "Nenhum nome encontrado",
      "submitButton": "Sortear Nomes"
    },
    
    // Numbers Lottery Form
    "numbersForm": {
      "rangeTitle": "Intervalo de números",
      "minLabel": "Mínimo",
      "maxLabel": "Máximo",
      "configTitle": "Configurações",
      "allowRepetition": "Permitir repetição",
      "quantityLabel": "Quantidade",
      "rangeWarning": "Máximo {{range}} números sem repetição",
      "sequentialLabel": "Revelação sequencial",
      "intervalLabel": "Intervalo (segundos)",
      "reverseLabel": "Ordem inversa",
      "submitButton": "Sortear Números"
    },
    
    // Sequence Form
    "sequenceForm": {
      "rangeTitle": "Intervalo de números",
      "minLabel": "Mínimo",
      "maxLabel": "Máximo",
      "configTitle": "Configurações",
      "allowRepetition": "Permitir repetição",
      "quantityLabel": "Tamanho da sequência",
      "rangeWarning": "Máximo {{range}} números sem repetição",
      "submitButton": "Gerar Sequência"
    },
    
    // Groups Lottery Form (renomeado para evitar conflito)
    "groupsForm": {
      "sourceTitle": "Fonte",
      "looseNames": "Nomes Avulsos",
      "peopleCount": "{{count}} pessoas",
      "configTitle": "Configuração",
      "membersLabel": "Membros por grupo",
      "distributeEvenly": "Distribuir uniformemente",
      "distributeSub": "Como distribuir cartas",
      "infoTotal": "{{total}} pessoas → {{groups}} grupos",
      "infoRemainder": "Último grupo com {{count}} membros",
      "infoPerfect": "Todos os grupos terão o mesmo número de membros",
      "emptyWarning": "Nenhum participante disponível",
      "button": "Sortear Grupos"
    },
    
    // Groups Result Modal
    "groupsResult": {
      "title": "Grupos Sorteados",
      "statusSorting": "Formando grupos...",
      "statusFinished": "Grupos prontos!",
      "groupLabel": "Grupo",
      "waiting": "Aguardando membros...",
      "drawAgain": "Sortear novos grupos"
    },
    
    // Result Modal geral
    "modal": {
      "resultTitle": "Resultado do Sorteio",
      "drawAgain": "Sortear novamente"
    },
    
    // Result Modal para nomes/números
    "result": {
      "numbersTitle": "Números Sorteados",
      "namesTitle": "Nomes Sorteados",
      "defaultTitle": "Resultado do Sorteio",
      "drawAgain": "Sortear novamente"
    }
  },

  // COMMON
  "common": {
    "success": "Sucesso",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "remove": "Remover",
    "save": "Salvar",
    "wait": "Aguarde...",
    "sorting": "Embaralhando...",
    "drawAgain": "Sortear novamente",
    "confirm": "Confirmar",
    "add": "Adicionar",
    "close": "Fechar",
    "edit": "Editar",
    "create": "Criar",
    "import": "Importar",
    "clear": "Limpar"
  },

  // SETTINGS
  "settings": {
    "header": {
      "title": "Configurações",
      "subtitle": "Personalize sua experiência"
    },
    "sections": {
      "appearance": "Aparência",
      "language": "Idioma",
      "data": "Dados",
      "about": "Sobre"
    },
    "items": {
      "theme": { 
        "title": "Tema",
        "dark": "Escuro",
        "light": "Claro"
      },
      "language": { 
        "title": "Idioma",
        "portuguese": "Português",
        "english": "Inglês"
      },
      "clearNames": {
        "title": "Limpar todos os nomes",
        "description": "Remove todos os nomes da lista atual"
      },
      "resetHistory": {
        "title": "Limpar histórico",
        "description": "Limpa todo o histórico de sorteios"
      },
      "appInfo": {
        "title": "Informações do aplicativo",
        "description": "Versão 1.0.0"
      }
    }
  }
};

const LANGUAGE_KEY = '@app_language';

const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) return callback(saved);
      callback(Localization.getLocales()[0].languageCode || 'en');
    } catch { callback('en'); }
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => AsyncStorage.setItem(LANGUAGE_KEY, lng),
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: { 
      en: { translation: en }, 
      pt: { translation: pt },
      es: { translation: en }, // Você pode adicionar espanhol depois
    },
    fallbackLng: 'en',
    interpolation: { 
      escapeValue: false 
    },
    compatibilityJSON: 'v3',
    react: { 
      useSuspense: false 
    }
  });

export default i18n;