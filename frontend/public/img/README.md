# Wedding Images Directory

このディレクトリに結婚式招待ページで使用する画像を配置してください。

## 必要な画像

- `header-background.jpg` - ヘッダーの背景画像（推奨: 1920x1080px以上）
- `groom-placeholder.jpg` - 新郎のプロフィール写真（推奨: 600x800px）
- `bride-placeholder.jpg` - 新婦のプロフィール写真（推奨: 600x800px）

## 使用方法

1. `sampleData.ts`または`WeddingInvitationPage`内で画像パスを指定
2. `/img/` ディレクトリに画像ファイルを配置
3. ビルド時に自動的に最適化されます

## 画像形式

- JPG/JPEG - 写真用
- PNG - 透明背景が必要な場合
- WebP - より最適化が必要な場合（next/imageで自動対応）

