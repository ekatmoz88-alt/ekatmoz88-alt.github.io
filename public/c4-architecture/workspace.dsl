workspace "Dossier Processing Workstation" "Evidence-based C4 reconstruction of the Dossier Processing Workstation. Unverified relationships are explicitly marked." {

  model {
    operator = person "Оператор" "Работает с приложением для обработки досье."

    workstation = softwareSystem "АРМ обработки досье" "Клиентское приложение в составе проектного контура ППО ПАК." {
      mobile = container "Мобильный модуль" "Подготавливает и экспортирует файлы досье." "Desktop application"
      stationary = container "Стационарный модуль" "Импортирует и обрабатывает переданные файлы досье." "Desktop application"
      localDb = container "Локальная база данных" "Хранит локальные данные приложения." "SQLite"
    }

    umms = softwareSystem "UMMS" "Связанная внешняя система."
    fias = softwareSystem "ФИАС" "Внешний справочный источник."
    media = softwareSystem "Съёмный носитель" "Файловый канал передачи между модулями."

    operator -> mobile "Работает с"
    operator -> stationary "Работает с"
    mobile -> media "Экспортирует файлы досье"
    stationary -> media "Импортирует файлы досье"
    stationary -> localDb "Читает и записывает локальные данные"
    workstation -> umms "Интеграционное взаимодействие — детали требуют проверки"
    workstation -> fias "Использование справочных данных — детали требуют проверки"

    importCommand = component stationary "ImportCommand" "Компонент сценария импорта."
    transferManager = component stationary "TransferManager" "Компонент управления передачей данных."
    caseProvider = component stationary "CaseProvider" "Компонент доступа к данным досье."
    connectionFactory = component stationary "ConnectionFactory" "Фабрика соединений с локальным хранилищем."
    sqliteCommand = component stationary "SQLiteCommandEx" "Расширенный слой выполнения SQLite-команд."
    sqliteReader = component stationary "SQLiteDataReaderEx" "Расширенный слой чтения результатов SQLite."
    sqliteMaps = component stationary "SQLiteMaps" "Компонент сопоставления данных SQLite."

    importCommand -> transferManager "Передаёт управление сценарием импорта (предварительная связь)"
    transferManager -> caseProvider "Обращается к данным досье (предварительная связь)"
    caseProvider -> connectionFactory "Получает соединение (предварительная связь)"
    caseProvider -> sqliteCommand "Выполняет операции с данными (предварительная связь)"
    sqliteCommand -> sqliteReader "Читает результаты (предварительная связь)"
    sqliteCommand -> sqliteMaps "Использует сопоставления (предварительная связь)"
    connectionFactory -> localDb "Открывает соединение (предварительная связь)"
  }

  views {
    systemContext workstation "SystemContext" {
      include *
      autolayout lr
    }

    container workstation "Containers" {
      include *
      autolayout lr
    }

    component stationary "StationaryComponents" {
      include *
      autolayout lr
    }

    styles {
      element "Person" {
        shape person
      }
      element "Software System" {
        background #1168bd
        color #ffffff
      }
      element "Container" {
        background #438dd5
        color #ffffff
      }
      element "Component" {
        background #85bbf0
        color #000000
      }
    }
  }
}