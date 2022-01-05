
  function puntGPX(x,y,z,t) {  
    return `<trkpt lat="${x}" lon="${y}"> <ele>${z}</ele> <time>${t}</time></trkpt>`;;
  }
  
  function peuGPX() {
    return `</trkseg></trk></gpx>`
  }
  
  function capGPX(id) {
    return `<?xml version="1.0" encoding="UTF-8"?>\r\n\
    <gpx creator="Traces NPN - https://ce-terrassa.org/npn" version="1.0"\r\n\
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \r\n\
    xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\r\n\
    <metadata>\r\n\
    \t<name>Track de seguiment de dispositiu</name>\r\n\
    \t<author>\r\n\
    \t\t<name>Nom del corredor/a</name>\r\n\
    \t\t<link href="https://ce-terrassa.org/npn">\r\n\
    \t\t\t<text>Traça de la 49a cursa Núria - Puigmal - Núria</text>\r\n\
    \t\t</link>\r\n\
    \t</author>\r\n\
    \t<link href="/npn-dorsal-001">\r\n\
    \t\t<text>Track de seguiment</text>\r\n\
    \t</link>\r\n\
    \t<time>2021-11-29T17:33:23Z</time>\r\n\
    </metadata>\r\n\
    <trk>\r\n\
    \t\t<name>npn-track-${id} - 49a Núria Puigmal Núria</name>\r\n\
    \t\t<trkseg>\r\n`
  }
  
