class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
        this.config = {
            questionsPerSubject: 3,
            randomizeChoices: true,
            selectedSubjects: []
        };
        this.subjects = {
            '専門医学': 'professional_medicine',
            '専門心理学': 'professional_psychology',
            '専門会計': 'professional_accounting',
            '哲学': 'philosophy',
            '雑学': 'miscellaneous',
            '医学遺伝学': 'medical_genetics',
            '形式論理': 'formal_logic',
            '先史学': 'prehistory',
            '天文学': 'astronomy',
            '熟語': 'japanese_idiom',
            '世界宗教': 'world_religions',
            '世界事実': 'global_facts',
            '世界史': 'world_history',
            '社会学': 'sociology',
            '栄養学': 'nutrition',
            '日本史': 'japanese_history',
            '日本地理': 'japanese_geography',
            '人間の老化': 'human_aging',
            '論理学': 'logical_fallacies',
            '倫理的議論': 'moral_disputes',
            '臨床知識': 'clinical_knowledge',
            '経営学': 'management',
            '解剖学': 'anatomy',
            '計量経済学': 'econometrics',
            '機械学習': 'machine_learning',
            '国際法': 'international_law',
            '公民': 'japanese_civics',
            '公共関係': 'public_relations',
            '高校心理学': 'high_school_psychology',
            '高校物理': 'high_school_physics',
            '高校統計学': 'high_school_statistics',
            '高校数学': 'high_school_mathematics',
            '高校生物学': 'high_school_biology',
            '高校情報科学': 'high_school_computer_science',
            '高校化学': 'high_school_chemistry',
            '高校地理': 'high_school_geography',
            '高校ヨーロッパ史': 'high_school_european_history',
            '高校ミクロ経済学': 'high_school_microeconomics',
            '高校マクロ経済学': 'high_school_macroeconomics',
            '概念物理学': 'conceptual_physics',
            '法理学': 'jurisprudence',
            '電気工学': 'electrical_engineering',
            '大学医学': 'college_medicine',
            '大学物理': 'college_physics',
            '大学数学': 'college_mathematics',
            '大学生物学': 'college_biology',
            '大学化学': 'college_chemistry',
            '大学コンピュータ科学': 'college_computer_science',
            '初等数学': 'elementary_mathematics',
            '抽象代数': 'abstract_algebra',
            'マーケティング': 'marketing',
            'ビジネス倫理': 'business_ethics',
            'セクシュアリティ': 'human_sexuality',
            'セキュリティ研究': 'security_studies',
            'コンピュータセキュリティ': 'computer_security',
            'ウイルス学': 'virology'
        };
        
        this.initializeElements();
        this.initializeStartScreen();
    }

    initializeElements() {
        // Get DOM elements
        this.loadingEl = document.getElementById('loading');
        this.quizContainerEl = document.getElementById('quiz-container');
        this.resultContainerEl = document.getElementById('result-container');
        this.errorContainerEl = document.getElementById('error-container');
        
        this.progressEl = document.getElementById('progress');
        this.questionNumberEl = document.getElementById('question-number');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.currentScoreEl = document.getElementById('current-score');
        this.subjectEl = document.getElementById('subject');
        this.questionEl = document.getElementById('question');
        this.choicesEl = document.getElementById('choices');
        
        this.scoreEl = document.getElementById('score');
        this.totalEl = document.getElementById('total');
        this.percentageEl = document.getElementById('percentage');
        this.resultDetailsEl = document.getElementById('result-details');
        this.restartBtnEl = document.getElementById('restart-btn');
        
        this.errorMessageEl = document.getElementById('error-message');
        this.reloadBtnEl = document.getElementById('reload-btn');

        // Start screen elements
        this.startContainerEl = document.getElementById('start-container');
        this.questionsPerSubjectEl = document.getElementById('questions-per-subject');
        this.randomizeChoicesEl = document.getElementById('randomize-choices');
        this.subjectCheckboxesEl = document.getElementById('subject-checkboxes');
        this.selectAllBtnEl = document.getElementById('select-all');
        this.deselectAllBtnEl = document.getElementById('deselect-all');
        this.startQuizBtnEl = document.getElementById('start-quiz');
        this.questionCountEl = document.getElementById('question-count');

        // Add event listeners
        this.restartBtnEl.addEventListener('click', () => this.restart());
        this.reloadBtnEl.addEventListener('click', () => this.initializeStartScreen());
        this.selectAllBtnEl.addEventListener('click', () => this.selectAllSubjects());
        this.deselectAllBtnEl.addEventListener('click', () => this.deselectAllSubjects());
        this.startQuizBtnEl.addEventListener('click', () => this.startQuiz());
        
        // Add event listeners for question count calculation
        this.questionsPerSubjectEl.addEventListener('change', () => this.updateQuestionCount());
        this.selectAllBtnEl.addEventListener('click', () => setTimeout(() => this.updateQuestionCount(), 0));
        this.deselectAllBtnEl.addEventListener('click', () => setTimeout(() => this.updateQuestionCount(), 0));
    }

    initializeStartScreen() {
        this.showStart();
        this.populateSubjectCheckboxes();
        this.config.selectedSubjects = Object.keys(this.subjects); // Default: all subjects selected
        this.updateQuestionCount();
    }

    populateSubjectCheckboxes() {
        this.subjectCheckboxesEl.innerHTML = '';
        
        Object.keys(this.subjects).forEach(subjectName => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'subject-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `subject-${subjectName}`;
            checkbox.value = subjectName;
            checkbox.checked = true; // Default: all selected
            
            // Add event listener for question count update
            checkbox.addEventListener('change', () => this.updateQuestionCount());
            
            const label = document.createElement('label');
            label.htmlFor = `subject-${subjectName}`;
            label.textContent = subjectName;
            
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            this.subjectCheckboxesEl.appendChild(checkboxDiv);
        });
    }

    selectAllSubjects() {
        const checkboxes = this.subjectCheckboxesEl.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = true);
    }

    deselectAllSubjects() {
        const checkboxes = this.subjectCheckboxesEl.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
    }

    updateQuestionCount() {
        const selectedValue = this.questionsPerSubjectEl.value;
        const checkboxes = this.subjectCheckboxesEl.querySelectorAll('input[type="checkbox"]:checked');
        const selectedSubjects = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedSubjects.length === 0) {
            this.questionCountEl.textContent = '0';
            return;
        }
        
        if (selectedValue === 'all') {
            // すべての問題の場合は概算値を表示
            const estimatedTotal = this.getEstimatedTotalQuestions(selectedSubjects);
            this.questionCountEl.textContent = estimatedTotal.toLocaleString();
        } else {
            const questionsPerSubject = parseInt(selectedValue);
            const totalQuestions = selectedSubjects.length * questionsPerSubject;
            this.questionCountEl.textContent = totalQuestions.toLocaleString();
        }
    }

    getEstimatedTotalQuestions(selectedSubjects) {
        // 各教科の正確な問題数（実際のデータに基づく）
        const actualQuestionCounts = {
            '専門医学': 150,
            '専門心理学': 150,
            '専門会計': 150,
            '哲学': 150,
            '雑学': 150,
            '医学遺伝学': 99,
            '形式論理': 125,
            '先史学': 150,
            '天文学': 148,
            '熟語': 150,
            '世界宗教': 147,
            '世界事実': 97,
            '世界史': 150,
            '社会学': 150,
            '栄養学': 149,
            '日本史': 150,
            '日本地理': 139,
            '人間の老化': 150,
            '論理学': 150,
            '倫理的議論': 148,
            '臨床知識': 150,
            '経営学': 102,
            '解剖学': 132,
            '計量経済学': 113,
            '機械学習': 111,
            '国際法': 120,
            '公民': 150,
            '公共関係': 109,
            '高校心理学': 150,
            '高校物理': 150,
            '高校統計学': 150,
            '高校数学': 150,
            '高校生物学': 148,
            '高校情報科学': 98,
            '高校化学': 149,
            '高校地理': 150,
            '高校ヨーロッパ史': 150,
            '高校ミクロ経済学': 149,
            '高校マクロ経済学': 148,
            '概念物理学': 150,
            '法理学': 107,
            '電気工学': 144,
            '大学医学': 150,
            '大学物理': 100,
            '大学数学': 99,
            '大学生物学': 143,
            '大学化学': 99,
            '大学コンピュータ科学': 99,
            '初等数学': 150,
            '抽象代数': 99,
            'マーケティング': 150,
            'ビジネス倫理': 86,
            'セクシュアリティ': 130,
            'セキュリティ研究': 150,
            'コンピュータセキュリティ': 99,
            'ウイルス学': 150
        };
        
        let totalEstimated = 0;
        selectedSubjects.forEach(subject => {
            totalEstimated += actualQuestionCounts[subject] || 150;
        });
        
        return totalEstimated;
    }

    startQuiz() {
        // Get configuration from form
        const selectedValue = this.questionsPerSubjectEl.value;
        this.config.questionsPerSubject = selectedValue === 'all' ? 'all' : parseInt(selectedValue);
        this.config.randomizeChoices = this.randomizeChoicesEl.checked;
        
        // Get selected subjects
        const checkboxes = this.subjectCheckboxesEl.querySelectorAll('input[type="checkbox"]:checked');
        this.config.selectedSubjects = Array.from(checkboxes).map(cb => cb.value);
        
        if (this.config.selectedSubjects.length === 0) {
            alert('少なくとも1つの教科を選択してください。');
            return;
        }
        
        this.loadQuestions();
    }

    showStart() {
        this.startContainerEl.style.display = 'block';
        this.loadingEl.style.display = 'none';
        this.quizContainerEl.style.display = 'none';
        this.resultContainerEl.style.display = 'none';
        this.errorContainerEl.style.display = 'none';
    }

    async loadQuestions() {
        try {
            this.showLoading();
            
            // Filter subjects based on selection
            const selectedSubjectEntries = Object.entries(this.subjects).filter(
                ([subjectName]) => this.config.selectedSubjects.includes(subjectName)
            );
            
            const allQuestions = [];
            let loadedCount = 0;
            let failedSubjects = [];
            
            console.log(`選択教科数: ${selectedSubjectEntries.length}`);
            console.log(`教科当たり出題数: ${this.config.questionsPerSubject}`);
            
            for (const [subjectName, fileName] of selectedSubjectEntries) {
                try {
                    const response = await fetch(`questions/${fileName}.csv`);
                    if (response.ok) {
                        const csvText = await response.text();
                        const questions = this.parseCSV(csvText, subjectName);
                        // 各教科から指定された問数を取得
                        const selectedQuestions = this.getRandomQuestions(questions, this.config.questionsPerSubject);
                        allQuestions.push(...selectedQuestions);
                        loadedCount++;
                        console.log(`${subjectName}: ${selectedQuestions.length}問読み込み成功`);
                    } else {
                        failedSubjects.push(`${subjectName} (${response.status})`);
                        console.warn(`教科 ${subjectName} の読み込みに失敗: ${response.status}`);
                    }
                } catch (error) {
                    failedSubjects.push(`${subjectName} (${error.message})`);
                    console.warn(`教科 ${subjectName} の読み込みに失敗しました:`, error);
                }
            }
            
            console.log(`読み込み成功: ${loadedCount}教科`);
            console.log(`読み込み失敗: ${failedSubjects.length}教科`, failedSubjects);
            console.log(`総問題数: ${allQuestions.length}問`);
            
            if (allQuestions.length === 0) {
                throw new Error('問題が見つかりませんでした');
            }
            
            // 問題をシャッフル
            this.questions = this.shuffleArray(allQuestions);
            this.initializeQuiz();
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    parseCSV(csvText, subjectName) {
        const questions = [];
        
        // より堅牢なCSV解析
        const rows = this.parseCSVRows(csvText);
        
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i];
            
            if (columns.length >= 6 && columns[0].trim()) {
                questions.push({
                    question: columns[0].trim(),
                    choices: {
                        A: columns[1].trim(),
                        B: columns[2].trim(),
                        C: columns[3].trim(),
                        D: columns[4].trim()
                    },
                    correct: columns[5].trim().toUpperCase(),
                    subject: subjectName
                });
            }
        }
        
        return questions;
    }

    parseCSVRows(csvText) {
        const rows = [];
        const lines = csvText.split('\n');
        let currentRow = [];
        let currentField = '';
        let inQuotes = false;
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i];
            let j = 0;
            
            while (j < line.length) {
                const char = line[j];
                
                if (char === '"') {
                    if (inQuotes && j + 1 < line.length && line[j + 1] === '"') {
                        // エスケープされた引用符
                        currentField += '"';
                        j += 2;
                    } else {
                        // 引用符の開始/終了
                        inQuotes = !inQuotes;
                        j++;
                    }
                } else if (char === ',' && !inQuotes) {
                    // フィールドの区切り
                    currentRow.push(currentField);
                    currentField = '';
                    j++;
                } else {
                    currentField += char;
                    j++;
                }
            }
            
            if (inQuotes) {
                // 複数行にわたるフィールド
                currentField += '\n';
                i++;
            } else {
                // 行の終了
                currentRow.push(currentField);
                if (currentRow.some(field => field.trim())) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
                i++;
            }
        }
        
        // 最後の行を処理
        if (currentRow.length > 0 || currentField) {
            currentRow.push(currentField);
            if (currentRow.some(field => field.trim())) {
                rows.push(currentRow);
            }
        }
        
        return rows;
    }

    initializeQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isAnswered = false;
        
        this.totalQuestionsEl.textContent = `/ ${this.questions.length}`;
        this.showQuiz();
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressEl.style.width = `${progress}%`;
        
        // Update question info
        this.questionNumberEl.textContent = `問題 ${this.currentQuestionIndex + 1}`;
        
        // Update current score (暫定正答率)
        this.updateCurrentScore();
        
        // Display subject
        this.subjectEl.textContent = question.subject;
        
        // Display question
        this.questionEl.textContent = question.question;
        
        // Prepare choices for display
        let choiceOrder = ['A', 'B', 'C', 'D'];
        let choiceMapping = {};
        
        if (this.config.randomizeChoices) {
            // Create randomized mapping
            const shuffledChoices = this.shuffleArray(['A', 'B', 'C', 'D']);
            choiceOrder.forEach((displayKey, index) => {
                choiceMapping[displayKey] = shuffledChoices[index];
            });
        } else {
            // Keep original order
            choiceOrder.forEach(key => {
                choiceMapping[key] = key;
            });
        }
        
        // Store the mapping for answer checking
        question.choiceMapping = choiceMapping;
        
        // Display choices
        const choiceButtons = this.choicesEl.querySelectorAll('.choice');
        choiceButtons.forEach((button, index) => {
            const displayKey = choiceOrder[index]; // A, B, C, D (display position)
            const originalKey = choiceMapping[displayKey]; // Original choice key
            button.textContent = question.choices[originalKey];
            button.className = 'choice';
            button.disabled = false;
            button.onclick = () => this.selectAnswer(originalKey, button);
        });
        
        this.isAnswered = false;
    }

    selectAnswer(selectedChoice, buttonEl) {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedChoice === question.correct;
        
        // Store user answer
        this.userAnswers.push({
            question: question.question,
            selected: selectedChoice,
            correct: question.correct,
            isCorrect: isCorrect,
            choices: question.choices
        });
        
        if (isCorrect) {
            this.score++;
        }
        
        // Show correct/incorrect styling
        const choiceButtons = this.choicesEl.querySelectorAll('.choice');
        choiceButtons.forEach((button, index) => {
            button.disabled = true;
            
            // Get the original choice key for this button position
            const displayKey = String.fromCharCode(65 + index); // A, B, C, D (display position)
            const originalKey = question.choiceMapping[displayKey]; // Original choice key
            
            if (originalKey === question.correct) {
                button.classList.add('correct');
            } else if (originalKey === selectedChoice && !isCorrect) {
                button.classList.add('incorrect');
            }
        });
        
        // Update current score after answer
        this.updateCurrentScore();
        
        // Auto advance to next question or show results
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.showResult();
        
        // Display score
        this.scoreEl.textContent = this.score;
        this.totalEl.textContent = this.questions.length;
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.percentageEl.textContent = percentage;
        
        // Display subject-wise results table
        this.resultDetailsEl.innerHTML = '';
        
        // Calculate subject-wise statistics
        const subjectStats = this.calculateSubjectStats();
        
        // Create table
        const table = document.createElement('table');
        table.className = 'subject-results-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>教科</th>
            <th>正答数</th>
            <th>出題数</th>
            <th>正答率</th>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Sort subjects by name for consistent display
        const sortedSubjects = Object.keys(subjectStats).sort();
        
        sortedSubjects.forEach(subject => {
            const stats = subjectStats[subject];
            const row = document.createElement('tr');
            
            const correctRate = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : '0.0';
            
            row.innerHTML = `
                <td class="subject-name">${subject}</td>
                <td class="correct-count">${stats.correct}</td>
                <td class="total-count">${stats.total}</td>
                <td class="correct-rate">${correctRate}%</td>
            `;
            
            // Add color coding based on performance
            if (stats.total > 0) {
                const rate = (stats.correct / stats.total) * 100;
                if (rate >= 80) {
                    row.classList.add('excellent');
                } else if (rate >= 60) {
                    row.classList.add('good');
                } else if (rate >= 40) {
                    row.classList.add('average');
                } else {
                    row.classList.add('poor');
                }
            }
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        this.resultDetailsEl.appendChild(table);
    }

    calculateSubjectStats() {
        const subjectStats = {};
        
        // Initialize stats for all subjects that appeared in the quiz
        this.questions.forEach(question => {
            if (!subjectStats[question.subject]) {
                subjectStats[question.subject] = {
                    correct: 0,
                    total: 0
                };
            }
        });
        
        // Count correct answers by subject
        this.userAnswers.forEach((answer, index) => {
            const question = this.questions[index];
            const subject = question.subject;
            
            subjectStats[subject].total++;
            if (answer.isCorrect) {
                subjectStats[subject].correct++;
            }
        });
        
        return subjectStats;
    }

    updateCurrentScore() {
        const answeredQuestions = this.userAnswers.length;
        if (answeredQuestions === 0) {
            this.currentScoreEl.textContent = '暫定正答率: 0.00%';
        } else {
            const currentPercentage = ((this.score / answeredQuestions) * 100).toFixed(2);
            this.currentScoreEl.textContent = `暫定正答率: ${currentPercentage}%`;
        }
    }

    getRandomSubjects(count) {
        const subjectEntries = Object.entries(this.subjects);
        const shuffled = this.shuffleArray([...subjectEntries]);
        return shuffled.slice(0, count);
    }

    getRandomQuestions(questions, count) {
        if (count === 'all') {
            // すべての問題を返す
            return this.shuffleArray([...questions]);
        }
        const shuffled = this.shuffleArray([...questions]);
        return shuffled.slice(0, count);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    restart() {
        this.initializeStartScreen(); // 再起動時にスタート画面に戻る
    }

    showLoading() {
        this.startContainerEl.style.display = 'none';
        this.loadingEl.style.display = 'block';
        this.quizContainerEl.style.display = 'none';
        this.resultContainerEl.style.display = 'none';
        this.errorContainerEl.style.display = 'none';
    }

    showQuiz() {
        this.loadingEl.style.display = 'none';
        this.quizContainerEl.style.display = 'block';
        this.resultContainerEl.style.display = 'none';
        this.errorContainerEl.style.display = 'none';
    }

    showResult() {
        this.loadingEl.style.display = 'none';
        this.quizContainerEl.style.display = 'none';
        this.resultContainerEl.style.display = 'block';
        this.errorContainerEl.style.display = 'none';
    }

    showError(message) {
        this.loadingEl.style.display = 'none';
        this.quizContainerEl.style.display = 'none';
        this.resultContainerEl.style.display = 'none';
        this.errorContainerEl.style.display = 'block';
        this.errorMessageEl.textContent = message;
    }
}

// Initialize the quiz app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
