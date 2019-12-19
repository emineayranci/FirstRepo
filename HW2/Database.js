class Course {
    constructor(name, time, date, ...rooms) {
        this.name = name;
        this.time = time;
        this.date = date;
        this.rooms = rooms;
    }
    toString() {
        return this.name;
    }
}
class Student {
    constructor(id, name, gpa, courses) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
        this.courses = courses;
    }
    toString() {
        return this.name;
    }
}
class Database {
    constructor() {
        this.students = new Map();
        this.courses = new Map();

    }

    findID(id) {
        return this.students.get(id)
    }
    coursesByStudent(id) {
        out.innerText = "";
        let t = id + " ";
        let std = this.findID(id);
        if (!std) {
            report(t + "not found"); return;
        }
        t += std.name;
        report(t, std.courses.length + " courses :");
        for (let c of std.courses)
            report(c)
    }
    studentList(code) {
        code = code.toUpperCase();
        let a = [];
        for (let std of this.students.values()) {
            if (std.courses.includes(code)) {
                a.push(std.id + " " + std.name);
            }
        }
        if (a.length > 0)
            report(code + ": ", a.length + " students", a);
        else report("No students in " + code);
    }
    randomStd() {
        out.innerText = "";
        let keys = [];
        for (let k of this.students.keys())
            keys.push(k);
        let i = Math.trunc(keys.length * Math.random());
        let b = this.students.get(keys[i]);
        report("Random Student : " + b.name, b.id);
    }
    randomRoom(){
        out.innerText = "";
        let rooms = [];
        for (let c of this.courses.values()){
            for(let r of c.rooms){
                rooms.push(r);
            }
        }
        let i=Math.trunc(rooms.length * Math.random());
        let b = rooms[i];
        report("Random Room : " + b);
    }
    findBest() {
        out.innerText = "";
        let keys = [];
        for (let k of this.students.keys())
            keys.push(k);
        let b = this.students.get(keys[0]);
        for (let std of this.students.values())
            if (std.gpa > b.gpa) b = std;
        report("Best: " + b.name, b.id);
    }
    aboveGpa(gpa) {
        out.innerText = "";
        let counter = 0;
        for (let std of this.students.values())
            if (std.gpa > gpa) counter++;


        report("Number of students above a given GPA : " + counter);
    }
    examSchedule(id) {
        let stu = this.findID(id);
        if(!stu){
            report("Not found");
            return;
        }
        let examCourses = []
        for (let c of stu.courses) {
            let course = this.courses.get(c);
            examCourses.push(course);
        }
        for (let c of examCourses)
            report(c.name, c.time);


    }
    courseList(room) {
        let dizi = [];
        for (let r of this.courses.values()) {
            if (r.rooms.includes(room)) {
                dizi.push(r);
                report(r.name);
            }
        }

    }
    counterOfCourses(room) {
        let counter = 0;
        for (let r of this.courses.values()) {
            if (r.rooms.includes(room)) {
                counter++;
            }
        }
        report("Total number of courses in a given room: "+counter);
    }
}

        const url = "https://maeyler.github.io/JS/data/";
        var database = new Database();
        readCourses("Courses.txt");
        readStudents("Students.txt");

        function report(msg, id, list) {
            out.innerHTML += "<br>"; msg += " ";
            out.appendChild(document.createTextNode(msg));
            let n1;
            if (id) {
                n1 = document.createElement("span");
                n1.appendChild(document.createTextNode(id));
                n1.classList.add("link");
                out.appendChild(n1); msg += id;
                //n1.addEventListener("click", doClick);
            }
            if (list) {
                let n2 = document.createElement("span");
                n2.appendChild(document.createTextNode(""));
                n2.innerHTML += list.join("<br>");
                n2.classList.add("course");
                if (n1) n1.appendChild(n2);
            }
            console.log(msg);
        }

        function doClick(evt) {
            //console.log(evt);
            let t = evt.target;
            let s = t.innerText;
            if (/^\d+$/.test(s)) database.coursesByStudent(s); //s contains digits
            else if (t = t.firstElementChild) {
                t.style.visibility = "";
                let hide = function () {
                    t.style.visibility = "hidden";
                };
                setTimeout(hide, 5000);
            }
        }
        function readStudents(file) {
            console.log("readStudents " + file);
            fetch(url + file)
                .then(r => r.text(), report)
                .then(addStudents, report);
        }
        function addStudents(txt) {
            let a = txt.split("\n");
            for (let s of a) {
                let std = parseStudent(s);
                database.students.set(std.id, std);
            }
        }
        function parseStudent(line) {
            let [id, name, gpa, ...courses] = line.split("\t");
            return { id, name, gpa, courses };
        }
        function readCourses(file) {
            console.log("readCourses" + file);
            fetch(url + file)
                .then(r => r.text(), report)
                .then(addCourses, report);
        }

        function addCourses(txt) {
            let msg = txt.length + " chars, ";
            let a = txt.split("\n");
            msg += a.length + " lines, ";
            for (let s of a) {
                let crs = this.parseCourses(s);
                database.courses.set(crs.name, crs);
            }
        }
        function parseCourses(line) {
            let [name, time, date, ...rooms] = line.split("\t");
            return { name, time, date, rooms };
        }