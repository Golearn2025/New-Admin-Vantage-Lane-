# @vantage-lane/ui-dashboard

Premium dashboard components with dual color palette system (NORMAL + NEON).

## 📦 Installation

```bash
npm install @vantage-lane/ui-dashboard recharts
```

## 🎨 Color Palettes

The library supports **TWO** color palettes:

### **NORMAL** (Professional)

Professional colors for traditional dashboards.

### **NEON** (Modern/Vibrant)

Vibrant neon colors for modern dark mode dashboards.

---

## 🚀 Usage Examples

### **Using Charts with Different Palettes**

```typescript
import {
  BarBasic,
  LineChart,
  CHART_COLORS,           // Auto (from CSS vars)
  CHART_COLORS_NORMAL,    // Professional colors
  CHART_COLORS_NEON       // Neon colors
} from '@vantage-lane/ui-dashboard';

// Default (uses CSS vars - respects globals.css)
<BarBasic
  data={data}
  color={CHART_COLORS.success}
/>

// Force NORMAL palette
<BarBasic
  data={data}
  color={CHART_COLORS_NORMAL.success}  // #10b981
/>

// Force NEON palette
<BarBasic
  data={data}
  color={CHART_COLORS_NEON.success}    // #10f77e
/>
```

---

### **Using Trend Colors**

```typescript
import { getTrendColor, type ColorPalette } from '@vantage-lane/ui-dashboard';

// Default (NEON)
const color = getTrendColor('up'); // #00ff88

// Explicit NEON
const colorNeon = getTrendColor('up', 'neon'); // #00ff88

// NORMAL palette
const colorNormal = getTrendColor('up', 'normal'); // #10b981
```

---

### **MetricCard with Gradients**

```typescript
import { MetricCard, GRADIENT_PRESETS } from '@vantage-lane/ui-dashboard';

<MetricCard
  spec={cardSpec}
  value={12345}
  delta={5.2}
  variant="gradient"
  gradient="purple"  // Uses GRADIENT_PRESETS.purple
/>
```

Available gradients: `purple`, `pink`, `blue`, `green`, `orange`, `gold`

---

## 📊 Available Colors

### **Chart Colors**

#### NORMAL (Professional)

- `primary`: #667eea (Purple)
- `success`: #10b981 (Green)
- `warning`: #f59e0b (Orange)
- `danger`: #ef4444 (Red)
- `info`: #3b82f6 (Blue)
- `gold`: #f1d16a (Gold)

#### NEON (Vibrant)

- `primary`: #a78bfa (Purple Neon)
- `success`: #10f77e (Green Neon)
- `warning`: #fbbf24 (Yellow Neon)
- `danger`: #ff2d55 (Pink-Red Neon)
- `info`: #0af5ff (Cyan Neon)
- `gold`: #ffd60a (Gold Neon)

---

### **Trend Colors**

#### NORMAL

- `up`: #10b981 (Green)
- `down`: #ef4444 (Red)
- `neutral`: #94a3b8 (Gray)

#### NEON

- `up`: #00ff88 (Neon Green)
- `down`: #ff2d55 (Neon Pink-Red)
- `neutral`: rgba(255, 255, 255, 0.7) (White)

---

## 🎯 Components

- **MetricCard** - Premium card with gradient variants
- **BarBasic** - Simple bar chart
- **LineChart** - Trend line chart
- **StackedBarChart** - Multi-series stacked bars
- **DonutChart** - Pie chart with center hole
- **WaterfallChart** - Financial waterfall

---

## 🌗 Dark Mode

All components are **dark mode optimized** by default with:

- Glassmorphism backgrounds
- Colored shadows and glow effects
- High contrast text
- Semi-transparent overlays

---

## 📄 License

Private - Vantage Lane
