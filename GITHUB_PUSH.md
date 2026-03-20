# GitHub'a yukleme

1. GitHub'da yeni bir repo olustur. Ornek ad: `gaKoy`
2. Bu klasorde terminal ac.
3. Asagidaki komutlari calistir:

```bash
git add .
git commit -m "Ilk surum: gaKoy Turkce duzenleme"
git remote add origin https://github.com/KULLANICI_ADIN/gaKoy.git
git push -u origin main
```

Eger Git senden kimlik isterse:

```bash
git config user.name "Adin"
git config user.email "eposta@example.com"
```

Sonra yeniden:

```bash
git add .
git commit -m "Ilk surum: gaKoy Turkce duzenleme"
git push -u origin main
```
