<svelte:head>
  <title>Datenschutzerklärung &amp; Nutzungsbedingungen | Ich brauch Urlaub</title>
  <meta
    name="description"
    content="Datenschutzerklärung, KI-Hinweise und Nutzungsbedingungen für Ich brauch Urlaub – den KI-Assistenten zu Urlaubsverfall, Fristen und Rechtsprechung von BAG und EuGH."
  />
  <meta name="robots" content="index,follow" />
</svelte:head>

<script>
  // Bei einer anderen Startseiten-Route diesen Pfad entsprechend ändern.
  const starterPage = "/";
  const contactEmail = "uspekhiwebdesign@gmail.com";
  
</script>

<main class="container">
  <nav class="topbar" aria-label="Seitennavigation">
    <a class="back" href={starterPage} aria-label="Zurück zur Startseite">← Zurück zur Startseite</a>
    <div class="updated">Stand: 19. Oktober 2026</div>
  </nav>

  <header>
    <h1>Datenschutz <span>&amp; Nutzungsbedingungen</span></h1>
    <p><strong>Ich brauch Urlaub</strong> – ein KI-gestützter Informationsassistent zu Urlaubsansprüchen, Urlaubsverfall, Fristen und der Rechtsprechung des Bundesarbeitsgerichts (BAG) und des Gerichtshofs der Europäischen Union (EuGH).</p>
  </header>

  <section id="ki-hinweis">
    <h2>1. Hinweis zur künstlichen Intelligenz (KI)</h2>
    <p>Diese Anwendung verwendet einen KI-gestützten Chat-Assistenten, um allgemeine Fragen zum Urlaubsrecht zu beantworten. Die Antworten werden automatisiert erstellt und nicht notwendigerweise in Echtzeit von einer Person geprüft.</p>
    <ul>
      <li>KI-Antworten können falsch, unvollständig, missverständlich oder nicht mehr aktuell sein.</li>
      <li>Gesetzliche Bestimmungen, Fristen, Urteile und Fundstellen können fehlerhaft oder unvollständig wiedergegeben werden.</li>
      <li>Die Antworten dienen ausschließlich der allgemeinen Information und stellen keine individuelle Rechtsberatung dar.</li>
      <li>Verlassen Sie sich bei drohendem Urlaubsverfall, laufenden Ausschlussfristen oder anderen rechtlich bedeutsamen Entscheidungen nicht allein auf die Antworten des Assistenten.</li>
      <li>Prüfen Sie wichtige Angaben anhand amtlicher Gesetzestexte und Originalentscheidungen oder holen Sie qualifizierten Rechtsrat ein.</li>
      <li>Geben Sie im Chat keine unnötigen personenbezogenen oder vertraulichen Informationen ein, etwa vollständige Namen, Personalnummern, Gesundheitsdaten oder vertrauliche Unterlagen Ihres Arbeitgebers.</li>
    </ul>
  </section>

  <section id="datenschutz">
    <h2>2. Datenschutzerklärung</h2>

    <h3>2.1 Verantwortlicher</h3>
    <p>Verantwortlich für die Verarbeitung personenbezogener Daten im Zusammenhang mit dieser Anwendung ist:</p>
    <p><strong>USPEKHI</strong><br /><br />E-Mail: <a href={`mailto:${contactEmail}`}>{contactEmail}</a><br />Website: <a href="https://ich-brauch-urlaub.web.app/" target="_blank" rel="noopener noreferrer">https://ich-brauch-urlaub.web.app/</a></p>

    <h3>2.2 Allgemeine Informationen</h3>
    <p>Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Personenbezogene Daten werden nach Maßgabe der Datenschutz-Grundverordnung (DSGVO), des Bundesdatenschutzgesetzes (BDSG) und der sonstigen anwendbaren Datenschutzvorschriften verarbeitet. Diese Erklärung informiert darüber, welche Daten bei der Nutzung der Anwendung verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte Sie haben.</p>

    <h3>2.3 Angaben, die Sie im Chat machen</h3>
    <p>Wenn Sie eine Frage in den Chat eingeben und absenden, wird der übermittelte Text verarbeitet, um eine Antwort zu erzeugen. Je nach technischer Umsetzung können auch vorherige Nachrichten derselben Unterhaltung berücksichtigt werden. Bitte übermitteln Sie nur Angaben, die für Ihre Frage erforderlich sind, und vermeiden Sie Informationen, durch die Sie oder andere Personen identifiziert werden können.</p>
    <p>Die konkrete Rechtsgrundlage hängt vom tatsächlichen Angebot und der Verarbeitung ab. Soweit die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen oder eines Vertrags erforderlich ist, kann Art. 6 Abs. 1 lit. b DSGVO einschlägig sein. In anderen Fällen kommt – sofern die Voraussetzungen erfüllt sind – beispielsweise Art. 6 Abs. 1 lit. f DSGVO in Betracht. Die endgültige Rechtsgrundlage ist anhand der tatsächlichen Nutzung und Datenverarbeitung festzulegen.</p>

    <h3>2.4 KI-Dienst und Firebase-Wissensbasis</h3>
    <p>Zur Erstellung von Antworten nutzt die Anwendung einen KI-Assistenten und eine Firebase-basierte Wissensbasis. Die übermittelten Fragen sowie gegebenenfalls der für die Antwort erforderliche Gesprächskontext können an die jeweils eingebundenen technischen Dienste übertragen und dort verarbeitet werden. Welche Daten gespeichert werden, wie lange sie gespeichert bleiben und ob sie vom jeweiligen Anbieter für weitere Zwecke verarbeitet werden, hängt von den konkret eingesetzten Diensten, deren Einstellungen und den geltenden Anbieterbedingungen ab.</p>
    <p>Die genaue KI-Komponente und die konkrete Firebase-Komponente sollten in dieser Erklärung ergänzt werden. Es wird nicht zugesichert, dass Chatnachrichten nicht gespeichert werden oder niemals zum Training von KI-Modellen verwendet werden, solange dies für die tatsächlich eingesetzten Dienste nicht geprüft und bestätigt wurde.</p>
    <p>Informationen zum Datenschutz bei Firebase: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase-Datenschutzinformationen</a>.<br />Allgemeine Informationen zum Datenschutz bei Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google-Datenschutzerklärung</a>.</p>

    <h3>2.5 Hosting und technische Zugriffsdaten</h3>
    <p>Die Anwendung wird unter der Domain <strong>ich-brauch-urlaub.web.app</strong> über Firebase Hosting bereitgestellt. Beim Aufruf können technisch erforderliche Daten verarbeitet werden, etwa IP-Adresse, Datum und Uhrzeit des Zugriffs, angeforderte Inhalte, Browser- und Geräteinformationen sowie technische Protokoll- und Fehlerdaten. Diese Verarbeitung kann zur Bereitstellung, Sicherheit, Fehlerbehebung und Abwehr von Missbrauch erforderlich sein.</p>
    <p>Soweit die Voraussetzungen vorliegen, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt im sicheren und funktionsfähigen Betrieb der Anwendung. Die tatsächliche Speicherdauer hängt von der Konfiguration und den Vorgaben der eingesetzten Dienste ab.</p>

    <h3>2.6 Google Analytics</h3>
    <p>Diese Anwendung verwendet Google Analytics, einen Webanalysedienst von Google. Damit wird ausgewertet, wie Besucher die Website nutzen, um Nutzungsmuster zu verstehen und die Anwendung zu verbessern. Abhängig von der Konfiguration können beispielsweise Seitenaufrufe, Interaktionen, technische Geräte- und Browserinformationen, Online-Kennungen, Cookie-Informationen und Informationen zur Herkunft von Zugriffen verarbeitet werden.</p>
    <p>Soweit für das Speichern von Informationen auf Ihrem Endgerät oder den Zugriff auf bereits gespeicherte Informationen eine Einwilligung nach § 25 TDDDG erforderlich ist, dürfen die entsprechenden Technologien erst nach einer wirksamen Einwilligung eingesetzt werden. Soweit die Verarbeitung personenbezogener Daten auf einer Einwilligung beruht, ist Art. 6 Abs. 1 lit. a DSGVO die Rechtsgrundlage. Die Einwilligung kann mit Wirkung für die Zukunft widerrufen werden. Ein Hinweis auf dieser Seite ersetzt keinen technisch wirksamen Einwilligungsmechanismus.</p>
    <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google-Datenschutzerklärung</a> und <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">Informationen zu Google Analytics</a>.</p>

    <h3>2.7 Cookies und vergleichbare Technologien</h3>
    <p>Die Anwendung und die eingebundenen Dienste können Cookies oder vergleichbare Technologien verwenden, etwa für technische Funktionen oder die Webanalyse. Nicht erforderliche Technologien werden, soweit gesetzlich vorgeschrieben, erst nach Ihrer Einwilligung aktiviert. Sofern eine Einwilligungsverwaltung angeboten wird, können Sie Ihre Auswahl dort ändern oder widerrufen. Die Deaktivierung bestimmter Technologien kann die Funktion der Anwendung einschränken.</p>

    <h3>2.8 Zwecke und Rechtsgrundlagen</h3>
    <p>Daten können verarbeitet werden, um den Chat bereitzustellen, Antworten zu erzeugen, die Wissensbasis zu nutzen, die Website technisch zu betreiben, Fehler zu beheben, Missbrauch zu verhindern und – nach Maßgabe der erforderlichen Einwilligungen – die Nutzung mit Google Analytics auszuwerten. Die Rechtsgrundlage ist für jeden Verarbeitungsvorgang anhand der tatsächlichen technischen Umsetzung und des jeweiligen Zwecks zu bestimmen.</p>

    <h3>2.9 Empfänger und Übermittlung in Drittländer</h3>
    <p>Daten können von den technischen Dienstleistern verarbeitet werden, die für Hosting, Infrastruktur, die Firebase-Wissensbasis, KI-Antworten und Webanalyse eingesetzt werden. Je nach Dienst und Konfiguration kann eine Verarbeitung außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums stattfinden. Eine solche Übermittlung muss die Anforderungen der Art. 44 ff. DSGVO erfüllen. Die konkreten Anbieter und Übermittlungsgrundlagen sind anhand der tatsächlich aktivierten Dienste zu prüfen und gegebenenfalls hier zu ergänzen.</p>

    <h3>2.10 Speicherdauer und Sicherheit</h3>
    <p>Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Pflichten eine längere Speicherung verlangen. Die konkrete Dauer richtet sich nach den Einstellungen der eingesetzten Dienste und den jeweils geltenden Speicherbedingungen. Es werden angemessene technische und organisatorische Schutzmaßnahmen angestrebt. Eine absolute Sicherheit der Datenübertragung über das Internet kann jedoch nicht garantiert werden.</p>

    <h3>2.11 Ihre Rechte</h3>
    <p>Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie nach Art. 7 Abs. 3 DSGVO jederzeit mit Wirkung für die Zukunft widerrufen.</p>
    <p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>

    <h3>2.12 Beschwerderecht</h3>
    <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere bei der Behörde Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Datenschutzverstoßes.</p>

    <h3>2.13 Änderungen und Kontakt</h3>
    <p>Diese Datenschutzerklärung kann angepasst werden, wenn sich die Funktionen der Anwendung, die eingesetzten Dienste oder die gesetzlichen Anforderungen ändern. Bei Fragen zum Datenschutz kontaktieren Sie bitte <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
  </section>

  <section id="nutzungsbedingungen">
    <h2>3. Nutzungsbedingungen</h2>

    <h3>3.1 Zweck der Anwendung</h3>
    <p>„Ich brauch Urlaub“ ist eine KI-gestützte Informationsanwendung zu Fragen des Urlaubsrechts. Sie soll eine erste Orientierung zu Urlaubsansprüchen, Urlaubsverfall, Fristen und einschlägiger Rechtsprechung des BAG und des EuGH bieten. Die Anwendung stellt keine individuelle Rechtsberatung dar.</p>

    <h3>3.2 Keine Gewähr für KI-Antworten</h3>
    <p>Die Antworten werden automatisiert erzeugt. Es wird keine Garantie dafür übernommen, dass sie richtig, vollständig, aktuell oder auf einen konkreten Einzelfall anwendbar sind. Insbesondere sollten Fristen, Ausschlussfristen und mögliche Ansprüche anhand verlässlicher Quellen überprüft werden. Bei rechtlich bedeutsamen Fragen wird empfohlen, qualifizierten Rechtsrat einzuholen.</p>

    <h3>3.3 Zulässige Nutzung</h3>
    <p>Die Anwendung darf nicht für rechtswidrige Zwecke genutzt werden. Untersagt sind insbesondere die Verletzung von Rechten Dritter, die Übermittlung rechtswidriger Inhalte, die Beeinträchtigung der technischen Sicherheit sowie Versuche, unbefugt auf Systeme oder Daten zuzugreifen.</p>

    <h3>3.4 Verfügbarkeit und Änderungen</h3>
    <p>Die Anwendung wird im Rahmen der technischen und betrieblichen Möglichkeiten bereitgestellt. Eine jederzeitige oder ununterbrochene Verfügbarkeit kann nicht garantiert werden. Funktionen können aus technischen, rechtlichen oder betrieblichen Gründen geändert, eingeschränkt oder eingestellt werden.</p>

    <h3>3.5 Geistiges Eigentum und eingegebene Inhalte</h3>
    <p>Die Gestaltung der Anwendung, ihr Name und eigene Inhalte können durch Schutzrechte geschützt sein. Rechte an den von Ihnen eingegebenen Inhalten verbleiben bei Ihnen beziehungsweise den jeweiligen Rechteinhabern. Durch das Absenden einer Chatnachricht erlauben Sie die technisch erforderliche Verarbeitung dieser Nachricht, soweit dies zur Bereitstellung des Dienstes und zur Erzeugung einer Antwort notwendig ist und rechtlich zulässig ist.</p>

    <h3>3.6 Haftung</h3>
    <p>Die gesetzlichen Haftungsregelungen bleiben unberührt. Insbesondere werden keine Haftungsausschlüsse vereinbart, soweit sie gesetzlich unzulässig sind. Nutzer sollten wichtige rechtliche Informationen nicht ungeprüft übernehmen und sich bei drohenden Fristen nicht allein auf KI-generierte Antworten verlassen.</p>

    <h3>3.7 Schlussbestimmungen</h3>
    <p>Es gelten die jeweils anwendbaren gesetzlichen Bestimmungen. Zwingende Verbraucherschutzrechte bleiben unberührt. Soweit einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein sollten, bleiben die übrigen Bestimmungen im Rahmen der gesetzlichen Vorgaben unberührt.</p>

    <h3>3.8 Kontakt</h3>
    <p>Fragen zu diesen Nutzungsbedingungen können an <a href={`mailto:${contactEmail}`}>{contactEmail}</a> gerichtet werden.</p>
  </section>

  <footer>
    <p>© 2026 Ich brauch Urlaub</p>
    <p><a href={starterPage}>Zurück zur Startseite</a> · <a href={`mailto:${contactEmail}`}>Kontakt</a></p>
  </footer>
</main>

<style>
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    min-width: 320px;
    margin: 0;
    background: radial-gradient(ellipse at top right, #142b49 0, #0b1220 52%);
    color: #edf4ff;
    font: 16px/1.7 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  :global(*) { box-sizing: border-box; }
  .container { width: min(900px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 56px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
  .back {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px;
    min-height: 44px;
    border: 1px solid #2a3a50; border-radius: 10px; background: #182437;
    color: #edf4ff; text-decoration: none; font-weight: 650;
  }
  .back:hover { border-color: #7bdcf4; background: #203149; }
  .updated { color: #b8c8dc; font-size: .85rem; text-align: right; }
  header, section {
    border: 1px solid #2a3a50; border-radius: 16px;
    background: #151f30; padding: clamp(20px, 4vw, 32px); margin-bottom: 18px;
  }
  h1 { margin: 0 0 8px; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.15; letter-spacing: -.04em; }
  h1 span, h2 { color: #7bdcf4; }
  h2 { margin: 0 0 14px; font-size: 1.4rem; }
  h3 { margin: 22px 0 8px; font-size: 1.05rem; }
  p, li { color: #b8c8dc; }
  strong { color: #edf4ff; }
  a { color: #7bdcf4; overflow-wrap: anywhere; }
  ul { padding-left: 22px; }
  footer { text-align: center; color: #b8c8dc; font-size: .9rem; padding-top: 16px; }
  @media (max-width: 520px) {
    .container {
      width: min(900px, calc(100% - 1.5rem - env(safe-area-inset-left) - env(safe-area-inset-right)));
      padding: 16px 0 calc(32px + env(safe-area-inset-bottom));
    }
    .topbar { align-items: flex-start; flex-direction: column; gap: 10px; margin-bottom: 16px; }
    .back { padding-inline: 12px; }
    .updated { text-align: left; font-size: .82rem; }
    header, section { padding: 18px 16px; margin-bottom: 12px; border-radius: 14px; }
    h1 { font-size: clamp(1.8rem, 8vw, 2.4rem); line-height: 1.12; }
    h2 { font-size: clamp(1.2rem, 5.2vw, 1.4rem); line-height: 1.3; }
    h3 { line-height: 1.4; }
    ul { padding-left: 20px; }
  }
</style>
