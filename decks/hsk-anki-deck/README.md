# HSK 1~3 Anki Deck

HSK 1~3급 필수어휘 600개 Anki 덱 작업 폴더.

## 최종 산출물

- `import_ready/HSK1-3급_필수어휘_단어장_600_통제어휘_9필드.txt`
  - Anki 노트 유형 9필드용 최종 import txt
  - 필드: `Word`, `MeaningKo`, `Pinyin`, `HanziBreakdown`, `ExampleZh`, `ExampleKo`, `ExamplePinyin`, `WordAudio`, `ExampleAudio`
  - 태그 열: `HSK1`, `HSK2`, `HSK3`
- `import_ready/HSK 1~3급 600단어_예문.apkg`
  - Anki에서 음성 및 카드 템플릿까지 작업한 패키지 export

## 폴더 구조

- `source/`: 원본 자료. PDF 원본은 로컬 보관용이며 Git 추적에서 제외.
- `source/anki_exports/`: 기존 Anki export 원본
- `generated/`: 중간 생성 txt
- `import_ready/`: Anki에 바로 넣을 최종본
- `scripts/`: 생성 및 예문 정리 스크립트

## 작업 메모

- 기존 3급 덱은 공식 HSK 3급 추가 어휘 300개에 거의 맞음.
- 1급 150개, 2급 150개를 추가하여 600카드 구성으로 정리.
- 예문은 여행/시험 상황을 살리되 HSK 1~3 내부어휘 중심으로 다듬음.
- 음성 필드는 `WordAudio`, `ExampleAudio`에 HyperTTS로 생성.
