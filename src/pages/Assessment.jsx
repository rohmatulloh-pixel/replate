import React, { useState, useEffect, useMemo } from 'react';
import { calculateRescueScore } from '../engine/rescueScore';
import { determineRoute } from '../engine/routeEngine';
import { matchDestinations } from '../engine/matchingEngine';
import ScoreBreakdown from '../components/ScoreBreakdown';
import MatchCard from '../components/MatchCard';
import { RouteBadge } from '../components/StatusBadge';
import Button from '../components/Button';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function Assessment({
  pendingReport,
  onDestinationSelected,
  onNavigate,
  lang = getActiveLanguage()
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

  const [processingIndex, setProcessingIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);

  const reportData = useMemo(() => pendingReport || {
    foodTypeId: 'cooked-rice',
    foodName: lang === 'id' ? 'Nasi Matang' : 'Cooked Rice',
    quantity: 8,
    unit: 'kg',
    conditionId: 'suitable',
    timeWindowId: '1_3h',
    sourceContextId: 'Catering',
    notes: 'Surplus catering pans.'
  }, [pendingReport, lang]);

  const assessmentResult = useMemo(() => {
    const scoreResult = calculateRescueScore(reportData);
    const routeResult = determineRoute(reportData);
    const matchedDestinations = matchDestinations({
      foodTypeId: reportData.foodTypeId,
      quantity: reportData.quantity,
      unit: reportData.unit,
      recommendedRoute: routeResult.route,
      timeWindowId: reportData.timeWindowId
    });

    return {
      score: scoreResult.score,
      priority: scoreResult.priority,
      priorityMeta: scoreResult.priorityMeta,
      scoreBreakdown: scoreResult.breakdown,
      rationale: scoreResult.rationale,
      route: routeResult.route,
      routeMeta: routeResult.routeMeta,
      routeWhy: routeResult.why,
      safetyNotice: routeResult.safetyNotice,
      matches: matchedDestinations
    };
  }, [reportData]);

  const PROCESSING_STEPS = lang === 'id' ? [
    'MEMERIKSA KARAKTERISTIK SURPLUS...',
    'MENGEVALUASI INTEGRITAS KONDISI...',
    'MENGHITUNG URGENSI WAKTU...',
    'MENGALIKASIKAN SKOR PENYELAMATAN...',
    'MENCOCOKKAN DENGAN MITRA PENERIMA...'
  ] : [
    'READING SURPLUS CHARACTERISTICS...',
    'CHECKING CONDITION INTEGRITY...',
    'EVALUATING TIME URGENCY...',
    'CALCULATING RESCUE POTENTIAL...',
    'MATCHING INTAKE DESTINATIONS...'
  ];

  // Quick processing animation (800ms)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < PROCESSING_STEPS.length) {
        setProcessingIndex(current);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 160);
    return () => clearInterval(interval);
  }, [PROCESSING_STEPS.length]);

  const handleSelectDestination = (destination, matchScore) => {
    setSelectedDestinationId(destination.id);
    if (onDestinationSelected) {
      onDestinationSelected({
        ...reportData,
        rescueScore: assessmentResult.score,
        priority: assessmentResult.priority,
        recommendedRoute: assessmentResult.route,
        selectedDestination: destination,
        matchScore: matchScore,
        journeyStatus: 'MATCHED'
      });
    }
  };

  const bestMatch = assessmentResult.matches[0];
  const otherMatches = assessmentResult.matches.slice(1);

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sun-400 to-brand-500 text-white flex items-center justify-center text-3xl mx-auto animate-spin shadow-card">
          🍲
        </div>
        <div>
          <h2 className="text-2xl font-display font-black text-brand-900">
            {t.report.calculating}
          </h2>
          <p className="text-xs font-mono font-bold text-brand-600 mt-2 tracking-wider">
            {PROCESSING_STEPS[processingIndex]}
          </p>
        </div>
        <div className="w-64 h-2.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-200"
            style={{ width: `${((processingIndex + 1) / PROCESSING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-brand-900 tracking-tight">
            {t.assessment.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans font-semibold">
            {t.assessment.subtitle} <strong>{reportData.quantity} {reportData.unit} {reportData.foodName}</strong>.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('report')}
          className="text-xs font-display font-bold"
        >
          {t.assessment.reAssessBtn}
        </Button>
      </div>

      {/* Grid: Rescue Score Breakdown + Route Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Score Breakdown */}
        <div className="lg:col-span-7">
          <ScoreBreakdown
            score={assessmentResult.score}
            priority={assessmentResult.priority}
            breakdown={assessmentResult.scoreBreakdown}
            rationale={assessmentResult.rationale}
          />
        </div>

        {/* Right: Route Recommendation */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-5">
          <div>
            <span className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              {t.assessment.recommendedRoute}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-display font-black text-brand-900">
                {assessmentResult.routeMeta.title}
              </span>
            </div>
            <div className="mt-2">
              <RouteBadge route={assessmentResult.route} className="text-xs px-3 py-1 font-extrabold" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans font-semibold">
            {assessmentResult.routeMeta.tagline}
          </p>

          {/* Explainable Why Points */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-400">
              {t.assessment.whyRoute}
            </span>
            <ul className="space-y-1.5 text-xs font-sans text-slate-700">
              {assessmentResult.routeWhy.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-600 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Destination Matches Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-900 tracking-tight">
            {t.assessment.destinationsTitle}
          </h2>
        </div>

        {/* Best Match Top Card */}
        {bestMatch && (
          <MatchCard
            match={bestMatch}
            isBestMatch={true}
            selected={selectedDestinationId === bestMatch.destination.id}
            onSelect={handleSelectDestination}
            lang={lang}
          />
        )}

        {/* Alternative Matches */}
        {otherMatches.length > 0 && (
          <div className="space-y-4 pt-2">
            {otherMatches.map((match) => (
              <MatchCard
                key={match.destination.id}
                match={match}
                isBestMatch={false}
                selected={selectedDestinationId === match.destination.id}
                onSelect={handleSelectDestination}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
