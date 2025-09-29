# PowerShell 터미널을 UTF-8로 설정하는 방법

## 1. 현재 세션에서 즉시 적용
```powershell
chcp 65001
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
```
- `chcp 65001` : 콘솔 코드 페이지를 UTF-8로 변경합니다.
- `$PSDefaultParameterValues` : `Get-Content`, `Out-File` 등 기본 인코딩을 UTF-8로 고정합니다.
- `$OutputEncoding` : 파이프라인과 외부 명령 출력이 깨지지 않도록 콘솔 출력 인코딩을 맞춥니다.

## 2. 적용 여부 확인
```powershell
Write-Output '한글 확인'
Get-Content .\intro.html -TotalCount 2
```
문자가 깨지지 않고 출력되면 UTF-8 설정이 정상 적용된 것입니다.

## 3. 새 세션마다 자동 적용하기
PowerShell 프로필 스크립트를 만들어 위 설정을 자동 실행하도록 합니다.
```powershell
if (-not (Test-Path -LiteralPath $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}
notepad $PROFILE
```
열린 프로필 파일에 아래 내용을 저장합니다.
```powershell
# Make PowerShell default to UTF-8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 > $null
```
이후 PowerShell(Windows Terminal, VS Code 터미널 등)을 새로 열면 자동으로 UTF-8 환경이 구성됩니다.

## 4. 설정 되돌리기
UTF-8 설정을 해제하려면 프로필 파일에서 위 네 줄을 삭제하거나 주석 처리한 뒤 새 세션을 열면 됩니다.
