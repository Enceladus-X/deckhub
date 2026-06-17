# DeckHub Preflight

DeckHub Preflight는 Anki TXT 덱을 브라우저 안에서만 읽어 검수하는 정적 도구입니다.

## 배포 위치

```text
/preflight/
```

GitHub Pages는 정적 호스팅이므로 TXT 본문을 서버로 업로드하지 않습니다. 파일 선택 또는 붙여넣기로 들어온 텍스트는 사용자의 브라우저에서만 처리됩니다.

## 검사 항목

- 세미콜론 필드 개수
- 보기 의존 표현
- 부정형 객관식 흔적
- 끝이 끊긴 OX 문장
- 지나치게 긴 앞면 또는 뒷면
- 정답 목록 과다
- 수치 정답의 단위 누락
- `n가지` 질문과 정답 항목 수 불일치

## 사용 흐름

1. `/preflight/`를 엽니다.
2. Anki TXT 파일을 업로드하거나 본문을 붙여넣습니다.
3. 검수를 실행합니다.
4. 자동 검출 목록 또는 무작위 샘플 카드를 클릭해 검수함으로 옮깁니다.
5. 사유와 메모를 붙인 뒤 `ANKI_REVIEW_FIX_REQUEST` 형식으로 복사합니다.
6. 필요하면 TSV 또는 JSON 리포트를 따로 저장합니다.

## 로컬 CLI

대량 자동 검사는 별도 로컬 패키지에서 수행할 수 있습니다.

```text
C:\Users\Holick\Desktop\Files\TASKS\PROJECTS\anki_deck_preflight
```

```powershell
python -m deck_preflight.cli check path\to\deck.txt --profile industrial_safety
python -m deck_preflight.cli sample path\to\deck.txt --count 20
```

브라우저 UI는 GitHub Pages에서 빠르게 사람이 검수하기 위한 도구이고, CLI는 큰 덱을 로컬에서 자동화할 때 쓰는 도구입니다.
