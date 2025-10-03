# NoCMS

## Admin-Zugang einrichten

### GitHub Fine-Grained Personal Access Token erstellen

Um sich im Admin-Bereich anzumelden, benötigen Sie einen GitHub Personal Access Token mit Zugriff auf dieses Repository.

1. **Gehen Sie zu GitHub Settings**
   - Öffnen Sie [GitHub](https://github.com)
   - Klicken Sie auf Ihr Profilbild → **Settings**
   - Im linken Menü: **Developer settings** → **Personal access tokens** → **Fine-grained tokens**

2. **Neuen Token erstellen**
   - Klicken Sie auf **Generate new token**

3. **Token konfigurieren**
   - **Token name**: Geben Sie einen Namen ein (z.B. "NoCMS Admin")
   - **Expiration**: Wählen Sie eine Ablaufdauer (z.B. 90 days)
   - **Repository access**: Wählen Sie **Only select repositories**
   - Wählen Sie das Repository **knuspermixx/NoCMS**

4. **Berechtigungen setzen**
   - Unter **Repository permissions** setzen Sie:
     - **Metadata**: `Read-only` (wird automatisch gesetzt)
     - **Contents**: `Read-only` (optional, aber empfohlen)

5. **Token generieren**
   - Klicken Sie unten auf **Generate token**
   - **Wichtig**: Kopieren Sie den Token sofort und speichern Sie ihn sicher
   - Der Token wird im Format `github_pat_...` angezeigt

6. **Im Admin-Bereich anmelden**
   - Öffnen Sie `/admin` auf Ihrer Website
   - Geben Sie den kopierten Token ein
   - Nach erfolgreicher Authentifizierung werden Sie zum Admin-Dashboard weitergeleitet
