(function (global) {
  const np = "н/п";
  const GRADE_COUNT = 27;

  function fillGrades(values) {
    const arr = new Array(GRADE_COUNT).fill(np);
    values.forEach(([index, val]) => {
      arr[index] = val;
    });
    return arr;
  }

  const RAW_ROWS = [
    {
      subject: "Дифференциальные и интегральные исчисления II",
      streams: [
        { stream: "MAT 1202-140-L", teacher: "Молдахмет Р.С.", grades: fillGrades([]) },
        { stream: "MAT 1202-140-P", teacher: "Омаров Б.К.", grades: fillGrades([]) },
        { stream: "MAT 1202-140-SRSP", teacher: "Молдахмет Р.С.", grades: fillGrades([]) },
      ],
    },
    {
      subject: "Иностранный язык 2",
      streams: [
        { stream: "LNG 1102-206-P", teacher: "Сагындыков А.А.", grades: fillGrades([]) },
        { stream: "LNG 1102-206-SRSP", teacher: "Сагындыков А.А.", grades: fillGrades([]) },
      ],
    },
    {
      subject: "Казахский (русский) язык 2",
      streams: [
        { stream: "LNG 1101-202-P", teacher: "Бабажанова М.Б.", grades: fillGrades([]) },
        { stream: "LNG 1101-202-SRSP", teacher: "Бабажанова М.Б.", grades: fillGrades([]) },
      ],
    },
    {
      subject: "Линейная алгебра",
      streams: [
        { stream: "MAT 1201-139-L", teacher: "Ускенбаев Г.Ж.", grades: fillGrades([]) },
        { stream: "MAT 1201-139-P", teacher: "Сарубай Т.А.", grades: fillGrades([]) },
        { stream: "MAT 1201-139-SRSP", teacher: "Ускенбаев Г.Ж.", grades: fillGrades([]) },
      ],
    },
    {
      subject: "Основы ИТ - телефония",
      streams: [
        { stream: "REST 1222-1-L", teacher: "Бесжанова Ж.К.", grades: fillGrades([]) },
        { stream: "REST 1222-1-P", teacher: "Абильдина Ж.С.", grades: fillGrades([]) },
        { stream: "REST 1222-1-SRSP", teacher: "Бесжанова Ж.К.", grades: fillGrades([]) },
      ],
    },
    {
      subject: "Физика",
      streams: [
        {
          stream: "PHY 1205-145-L",
          teacher: "Кайыпжанова К.С.",
          grades: fillGrades([[6, 100], [14, 79]]),
        },
        {
          stream: "PHY 1205-145-P",
          teacher: "Кайыпжанова К.С.",
          grades: fillGrades([[4, 70], [11, 20]]),
        },
        {
          stream: "PHY 1205-145-Lab",
          teacher: "Кайыпжанова К.С.",
          grades: fillGrades([]),
        },
        {
          stream: "PHY 1205-145-SRSP",
          teacher: "Кайыпжанова К.С.",
          grades: fillGrades([]),
        },
      ],
    },
    {
      subject: "Физическая культура",
      streams: [
        {
          stream: "PHE 1101-102-P",
          teacher: "Дуйсенбаев М.К.",
          grades: fillGrades([[0, 75], [1, 79], [8, 100]]),
        },
        {
          stream: "PHE 1101-102-SRSP",
          teacher: "Болат С.",
          grades: fillGrades([]),
        },
      ],
    },
  ];

  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function randomGrade60to80(seed) {
    return Math.floor(seededRandom(seed) * 21) + 60;
  }

  function isNp(val) {
    return val === np || val === "н.п." || val === "н.п";
  }

  function parseNum(val) {
    if (isNp(val)) return null;
    const s = String(val).replace(",", ".").replace("%", "").trim();
    if (s === "" || /^[A-F][+-]?$/i.test(s)) return null;
    const n = parseFloat(s);
    return Number.isNaN(n) ? null : n;
  }

  function transformNumeric(val, seed) {
    const n = parseNum(val);
    if (isNp(val) || (n !== null && n < 60)) {
      return {
        display: String(randomGrade60to80(seed)),
        wasNp: isNp(val),
        modified: true,
      };
    }
    return { display: String(val), wasNp: false, modified: false };
  }

  function letterFromPercent(p) {
    if (p >= 95) return "A";
    if (p >= 90) return "A-";
    if (p >= 85) return "B+";
    if (p >= 80) return "B";
    if (p >= 75) return "C+";
    if (p >= 70) return "C";
    if (p >= 65) return "D+";
    return "D";
  }

  function buildFinalGrades(numericCells) {
    const nums = numericCells
      .map((c) => parseFloat(c.display))
      .filter((n) => !Number.isNaN(n));
    const avg = nums.length
      ? nums.reduce((sum, n) => sum + n, 0) / nums.length
      : 70;
    const rounded = Math.round(avg * 100) / 100;
    return [
      { display: rounded.toFixed(2), wasNp: false, modified: false },
      { display: letterFromPercent(rounded), wasNp: false, modified: false },
    ];
  }

  function processRows(rows) {
    let seed = 1;
    return rows.map((block) => ({
      subject: block.subject,
      streams: block.streams.map((s) => {
        const numeric = s.grades.map((g) => transformNumeric(g, seed++));
        const finals = buildFinalGrades(numeric);
        return {
          stream: s.stream,
          teacher: s.teacher,
          grades: [...numeric, ...finals],
        };
      }),
    }));
  }

  function renderJournalTable(container) {
    const processed = processRows(RAW_ROWS);
    const gradeHeaders = [
      "1", "2", "3", "4", "5", "6", "7",
      "П1", "РК1", "Р1",
      "8", "9", "10", "11", "12", "13", "14", "15",
      "П2", "РК2 общ", "РК2", "Р2",
      "Оценка за курсовую работу",
      "Практика",
      "Исследоват. работа",
      "Рейтинг допуска",
      "Итоговый контроль",
    ];

    const table = document.createElement("table");
    table.className = "journal-table";

    const thead = document.createElement("thead");
    const row1 = document.createElement("tr");

    const thDisc = document.createElement("th");
    thDisc.className = "col-discipline";
    thDisc.rowSpan = 2;
    thDisc.textContent = "Дисциплина";
    row1.appendChild(thDisc);

    const thStream = document.createElement("th");
    thStream.className = "col-stream";
    thStream.rowSpan = 2;
    thStream.textContent = "Учебный поток";
    row1.appendChild(thStream);

    const thTeacher = document.createElement("th");
    thTeacher.className = "col-teacher";
    thTeacher.rowSpan = 2;
    thTeacher.textContent = "Преподаватель";
    row1.appendChild(thTeacher);

    gradeHeaders.forEach((h) => {
      const th = document.createElement("th");
      th.rowSpan = 2;
      th.textContent = h;
      row1.appendChild(th);
    });

    const thFinal = document.createElement("th");
    thFinal.colSpan = 2;
    thFinal.textContent = "Итоговая оценка";
    row1.appendChild(thFinal);

    const row2 = document.createElement("tr");
    const thPct = document.createElement("th");
    thPct.textContent = "%";
    const thLetter = document.createElement("th");
    thLetter.textContent = "Буквенная";
    row2.appendChild(thPct);
    row2.appendChild(thLetter);

    thead.appendChild(row1);
    thead.appendChild(row2);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    processed.forEach((block) => {
      block.streams.forEach((s, idx) => {
        const tr = document.createElement("tr");
        if (idx === 0) tr.classList.add("subject-row");

        if (idx === 0) {
          const tdSub = document.createElement("td");
          tdSub.className = "col-discipline";
          tdSub.rowSpan = block.streams.length;
          tdSub.textContent = block.subject;
          tr.appendChild(tdSub);
        }

        const tdStream = document.createElement("td");
        tdStream.className = "col-stream";
        tdStream.textContent = s.stream;
        tr.appendChild(tdStream);

        const tdTeacher = document.createElement("td");
        tdTeacher.className = "col-teacher";
        tdTeacher.textContent = s.teacher;
        tr.appendChild(tdTeacher);

        s.grades.forEach((g) => {
          const td = document.createElement("td");
          td.textContent = g.display;
          if (g.modified) td.classList.add("cell-modified");
          else if (isNp(g.display)) td.classList.add("cell-np");
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    });

    table.appendChild(tbody);
    container.innerHTML = "";
    container.appendChild(table);
  }

  global.PlatonusJournal = { renderJournalTable };
})(typeof window !== "undefined" ? window : this);
