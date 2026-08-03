import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

export function ComplianceScoreCard({ score }: { score: number }) {
  const data = [{ name: 'score', value: score, fill: '#14B8A6' }];

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 dark:bg-primary/10" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-secondary dark:text-dark-subtext">Global Compliance Score</p>
          <div className="mt-2 flex items-baseline gap-2">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-4xl font-extrabold tracking-tight text-ink-primary dark:text-dark-text"
            >
              {score}%
            </motion.span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-success dark:bg-success/10">
              <Icon name="ArrowUpRight" size={12} /> +1.1 pts
            </span>
          </div>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-secondary dark:text-dark-subtext">
            Basé sur les audits, CAPA, documents et alertes IoT actifs sur l'ensemble des sites.
          </p>
        </div>
        <div className="h-32 w-32 shrink-0">
          <RadialBarChart
            width={128} height={128} innerRadius="72%" outerRadius="100%"
            data={data} startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#F1F5F9' }} dataKey="value" cornerRadius={30} />
          </RadialBarChart>
        </div>
      </div>
    </Card>
  );
}
