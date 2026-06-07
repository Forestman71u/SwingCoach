const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const emptyVideo = document.getElementById('emptyVideo');
const analyzeBtn = document.getElementById('analyzeBtn');
const sampleSwingBtn = document.getElementById('sampleSwingBtn');
const clubSelect = document.getElementById('clubSelect');
const angleSelect = document.getElementById('angleSelect');
const engineSelect = document.getElementById('engineSelect');
const skillSelect = document.getElementById('skillSelect');
const apiSettings = document.getElementById('apiSettings');
const apiEndpoint = document.getElementById('apiEndpoint');
const analysisStatus = document.getElementById('analysisStatus');
const resetBtn = document.getElementById('resetBtn');

const mainIssue = document.getElementById('mainIssue');
const mainIssueCopy = document.getElementById('mainIssueCopy');
const strengthTitle = document.getElementById('strengthTitle');
const strengthCopy = document.getElementById('strengthCopy');
const cueTitle = document.getElementById('cueTitle');
const cueCopy = document.getElementById('cueCopy');
const metricsList = document.getElementById('metricsList');
const practiceFocus = document.getElementById('practiceFocus');
const practicePlan = document.getElementById('practicePlan');
const heroScore = document.getElementById('heroScore');
const heroFocus = document.getElementById('heroFocus');
const insightsList = document.getElementById('insightsList');
const payloadPreview = document.getElementById('payloadPreview');

const metricNames = ['Tempo', 'Club Path', 'Weight Transfer', 'Balance', 'Hip Rotation'];
const insightNames = ['Setup posture', 'Head stability', 'Lead arm structure', 'Shoulder turn', 'Finish hold'];
const sampleSwing = {
  src: 'assets/sample-swing.mp4',
  poster: 'assets/sample-swing-poster.jpg',
  club: 'driver',
  angle: 'face-on'
};

const coachingLibrary = {
  driver: [
    {
      issue: 'Club path is cutting across the ball',
      detail: 'Your downswing appears slightly over-the-top, which can create a fade or slice pattern with the driver.',
      strength: 'Athletic finish position',
      strengthDetail: 'You are staying balanced after impact, which gives you a solid foundation to build from.',
      cue: 'Drop it into the slot',
      cueDetail: 'Feel the club shallow behind you before rotating hard through the ball.',
      focus: 'Club Path',
      drills: ['Headcover outside-the-ball drill', 'Slow-motion downswing rehearsals', 'Three-quarter driver swings focused on inside path']
    },
    {
      issue: 'Tempo gets quick from the top',
      detail: 'The transition from backswing to downswing looks rushed, making it harder to square the face consistently.',
      strength: 'Good shoulder turn',
      strengthDetail: 'You are creating enough turn to generate power without overswinging too much.',
      cue: 'Pause, then fire',
      cueDetail: 'Feel a tiny pause at the top before starting the downswing with your lower body.',
      focus: 'Tempo',
      drills: ['Count 1-2-3 tempo swings', 'Pause-at-the-top drill', 'Hit 10 balls at 70% speed']
    }
  ],
  iron: [
    {
      issue: 'Weight transfer is late',
      detail: 'Your pressure appears to stay on the trail foot too long, which can cause thin or inconsistent contact.',
      strength: 'Solid posture at address',
      strengthDetail: 'Your setup position gives you a good chance to make repeatable contact.',
      cue: 'Step into the lead side',
      cueDetail: 'Start the downswing by feeling pressure move into your lead foot.',
      focus: 'Weight Transfer',
      drills: ['Step-through drill', 'Lead-foot pressure rehearsal', 'Half swings with finish held for 3 seconds']
    }
  ],
  wedge: [
    {
      issue: 'Distance control needs a tighter tempo',
      detail: 'Your wedge swing looks a little long for the shot length, which can make speed control harder.',
      strength: 'Soft hands through impact',
      strengthDetail: 'You are not forcing the club through impact, which is good for touch shots.',
      cue: 'Shorter back, smoother through',
      cueDetail: 'Match backswing length to carry distance and keep the finish controlled.',
      focus: 'Tempo',
      drills: ['Clock-face wedge drill', 'Landing spot challenge', 'Three distances with the same wedge']
    }
  ],
  putter: [
    {
      issue: 'Face control varies through impact',
      detail: 'The putter face appears to rotate slightly through the strike, which can start putts off line.',
      strength: 'Stable lower body',
      strengthDetail: 'Your legs stay quiet, helping your stroke stay repeatable.',
      cue: 'Rock the shoulders',
      cueDetail: 'Feel the putter move with your shoulders instead of your hands.',
      focus: 'Balance',
      drills: ['Gate drill', 'Coin roll start-line drill', 'One-handed trail-hand putting strokes']
    }
  ]
};

function getRandomScore(min = 48, max = 91) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildMetrics(focus) {
  const metrics = {};
  metricNames.forEach(name => {
    metrics[name] = getRandomScore(54, 88);
  });
  metrics[focus] = getRandomScore(38, 58);
  return metrics;
}

function buildInsights(focus) {
  const insightMap = {
    'Tempo': 'Transition is quick from the top',
    'Club Path': 'Downswing path trends across the ball',
    'Weight Transfer': 'Pressure shift into lead side is late',
    'Balance': 'Finish hold needs more stability',
    'Hip Rotation': 'Hips could clear earlier through impact'
  };
  return {
    'Setup posture': getRandomScore(64, 91) + '% stable',
    'Head stability': getRandomScore(52, 84) + '% centered',
    'Lead arm structure': getRandomScore(55, 88) + '% maintained',
    'Shoulder turn': getRandomScore(58, 90) + '% complete',
    'Finish hold': focus === 'Balance' ? 'Needs work' : 'Mostly stable',
    'Detected pattern': insightMap[focus] || 'General consistency opportunity'
  };
}

function renderInsights(insights) {
  insightsList.innerHTML = '';
  Object.entries(insights).forEach(([name, value]) => {
    const row = document.createElement('div');
    row.className = 'insight-row';
    row.innerHTML = `<span>${name}</span><strong>${value}</strong>`;
    insightsList.appendChild(row);
  });
}

function buildCoachPayload(result, metrics, insights) {
  return {
    appMode: engineSelect.value,
    skillLevel: skillSelect.value,
    club: clubSelect.value,
    cameraAngle: angleSelect.value,
    priorityFocus: result.focus,
    mockMetrics: metrics,
    mockVideoInsights: insights,
    instruction: 'Write concise golf coaching feedback, one priority fix, three drills, and a one-week practice plan.'
  };
}

function renderPayload(payload) {
  payloadPreview.textContent = JSON.stringify(payload, null, 2);
}

async function tryApiCoach(payload, fallbackResult) {
  const endpoint = apiEndpoint.value.trim();
  if (!endpoint) {
    return { ...fallbackResult, apiNote: 'API Coach Mode selected, but no endpoint was entered. Used local demo coaching instead.' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    return {
      ...fallbackResult,
      issue: data.issue || fallbackResult.issue,
      detail: data.detail || fallbackResult.detail,
      strength: data.strength || fallbackResult.strength,
      strengthDetail: data.strengthDetail || fallbackResult.strengthDetail,
      cue: data.cue || fallbackResult.cue,
      cueDetail: data.cueDetail || fallbackResult.cueDetail,
      drills: Array.isArray(data.drills) ? data.drills : fallbackResult.drills,
      apiNote: 'Coaching response returned from your backend endpoint.'
    };
  } catch (error) {
    return { ...fallbackResult, apiNote: `Could not reach endpoint. Used demo coaching instead. ${error.message}` };
  }
}

function renderMetrics(metrics) {
  metricsList.innerHTML = '';
  Object.entries(metrics).forEach(([name, value]) => {
    const row = document.createElement('div');
    row.className = 'metric-row';
    row.innerHTML = `
      <div class="metric-top"><span>${name}</span><span>${value}%</span></div>
      <div class="bar"><div class="fill" style="width:${value}%"></div></div>
    `;
    metricsList.appendChild(row);
  });
}

function renderAnalysis(result, metrics, insights, payload) {
  mainIssue.textContent = result.issue;
  mainIssueCopy.textContent = result.detail;
  strengthTitle.textContent = result.strength;
  strengthCopy.textContent = result.strengthDetail;
  cueTitle.textContent = result.cue;
  cueCopy.textContent = result.cueDetail;

  practiceFocus.textContent = `Focus Area: ${result.focus}`;
  practicePlan.innerHTML = `
    <p><strong>Goal:</strong> Complete 3 focused practice sessions this week.</p>
    <ul>${result.drills.map(drill => `<li>${drill}</li>`).join('')}</ul>
    <p><strong>Coach note:</strong> Film another swing after practicing and compare your movement pattern.</p>
  `;

  renderMetrics(metrics);
  renderInsights(insights);
  renderPayload(payload);

  const score = Math.round(Object.values(metrics).reduce((a, b) => a + b, 0) / metricNames.length);
  heroScore.textContent = score;
  heroFocus.textContent = `Improve ${result.focus.toLowerCase()} with ${result.drills[0].toLowerCase()}.`;
  analysisStatus.textContent = result.apiNote ? result.apiNote : 'Analysis complete';
  analysisStatus.classList.add('ready');

  localStorage.setItem('swingcoach-analysis', JSON.stringify({ ...result, metrics, insights, payload, score }));
}

function loadSavedAnalysis() {
  const saved = localStorage.getItem('swingcoach-analysis');
  if (!saved) {
    renderMetrics(Object.fromEntries(metricNames.map(name => [name, 0])));
    renderInsights(Object.fromEntries(insightNames.map(name => [name, '—'])));
    return;
  }
  const result = JSON.parse(saved);
  mainIssue.textContent = result.issue;
  mainIssueCopy.textContent = result.detail;
  strengthTitle.textContent = result.strength;
  strengthCopy.textContent = result.strengthDetail;
  cueTitle.textContent = result.cue;
  cueCopy.textContent = result.cueDetail;
  practiceFocus.textContent = `Focus Area: ${result.focus}`;
  practicePlan.innerHTML = `
    <p><strong>Goal:</strong> Complete 3 focused practice sessions this week.</p>
    <ul>${result.drills.map(drill => `<li>${drill}</li>`).join('')}</ul>
    <p><strong>Coach note:</strong> Film another swing after practicing and compare your movement pattern.</p>
  `;
  renderMetrics(result.metrics);
  renderInsights(result.insights || Object.fromEntries(insightNames.map(name => [name, '—'])));
  renderPayload(result.payload || { note: 'Saved analysis was created before payload preview existed.' });
  heroScore.textContent = result.score;
  heroFocus.textContent = `Improve ${result.focus.toLowerCase()} with ${result.drills[0].toLowerCase()}.`;
  analysisStatus.textContent = 'Saved analysis loaded';
  analysisStatus.classList.add('ready');
}

function showVideo(src, statusText, poster = '') {
  videoPreview.src = src;
  videoPreview.poster = poster;
  videoPreview.style.display = 'block';
  emptyVideo.style.display = 'none';
  analysisStatus.textContent = statusText;
  analysisStatus.classList.remove('ready');
}

videoInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const videoUrl = URL.createObjectURL(file);
  showVideo(videoUrl, 'Swing uploaded');
});

sampleSwingBtn.addEventListener('click', () => {
  clubSelect.value = sampleSwing.club;
  angleSelect.value = sampleSwing.angle;
  showVideo(sampleSwing.src, 'Sample swing loaded', sampleSwing.poster);
  videoPreview.load();
  videoPreview.play().catch(() => {
    // Some browsers block autoplay. The video is still loaded and ready for the user to press play.
  });
});

analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing swing...';
  analysisStatus.textContent = engineSelect.value === 'api' ? 'Preparing coaching payload' : 'Analyzing motion';
  analysisStatus.classList.remove('ready');

  setTimeout(async () => {
    const club = clubSelect.value;
    const library = coachingLibrary[club];
    const selected = library[Math.floor(Math.random() * library.length)];
    const angle = angleSelect.value.replaceAll('-', ' ');
    const fallbackResult = { ...selected, angle, club };
    const metrics = buildMetrics(fallbackResult.focus);
    const insights = buildInsights(fallbackResult.focus);
    const payload = buildCoachPayload(fallbackResult, metrics, insights);
    let finalResult = fallbackResult;

    if (engineSelect.value === 'api') {
      analysisStatus.textContent = 'Calling coaching endpoint';
      finalResult = await tryApiCoach(payload, fallbackResult);
    }

    renderAnalysis(finalResult, metrics, insights, payload);
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze My Swing';
  }, 700);
});

engineSelect.addEventListener('change', () => {
  apiSettings.classList.toggle('hidden', engineSelect.value !== 'api');
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('swingcoach-analysis');
  location.reload();
});

loadSavedAnalysis();
