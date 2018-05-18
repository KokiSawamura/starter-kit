# 開発環境テンプレート

## モジュールのインストール
```bash
npm install
```

## 開発の流れ

1.環境の立ち上げ

```bash
gulp
```

2.コーディング

EJS、SASSはファイル保存時にコンパイルされます

3.ビルド

JS、CSSはミニファイされたファイルも出力されます
CSSはlatest 10 versionsでオートプレフィックスされます
```bash
gulp build
```

## その他機能
### スプライト
下記構成でコマンドを実行
```bash
gulp sprite
```
```bash
app/sprite/***.jpg //拡張子はjpg png gif
```

### 画像圧縮
app配下の画像が圧縮されます。
```bash
gulp optimize
```

## 構造
```bash
root
├── README.md
├── app
├── gulpfile.js
├── node_modules
├── package-lock.json
└── package.json
```