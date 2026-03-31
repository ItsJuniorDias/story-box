require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'Unity'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/ItsJuniorDias/story-box' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # 1. Informa ao CocoaPods para embutir o Framework da Unity.
  # Isso assume que você colocou a pasta exportada da Unity dentro da pasta "ios" 
  # do seu módulo, com o nome "UnityExport".
  s.vendored_frameworks = 'UnityFramework.framework'

  # 2. Configurações do Compilador e Linker
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    # Força a linkagem do UnityFramework
    'OTHER_LDFLAGS' => '$(inherited) -framework UnityFramework',
    # Ajuda o Xcode a encontrar o caminho do framework durante o build do Expo
    'FRAMEWORK_SEARCH_PATHS' => '$(inherited) "${PODS_ROOT}/../.symlinks/plugins/Unity/ios/UnityExport"'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end