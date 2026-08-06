/*
{
  "JIT": {
    "Functions": 4,
    "Options": {
      "Inlining": true,
      "Optimization": true,
      "Expressions": true,
      "Deforming": true
    },
    "Timing": {
      "Generation": {
        "Deform": 0.116,
        "Total": 0.730
      },
      "Inlining": 7.659,
      "Optimization": 16.384,
      "Emission": 13.031,
      "Total": 37.803
    }
  }
}
*/

const jitFields = {
	JIT: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Root Level Plan', 'Workers'],
		description:
			'JIT compilation metrics container. Only appears when JIT actually ran, which in practice means the query was executed (ANALYZE); the whole section is also suppressed with COSTS OFF.',
		example: {},
		requiredExplainMods: ['ANALYZE']
	},
	Functions: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['JIT'],
		description: 'Number of functions JIT-compiled.',
		details:
			"Postgres's JIT compiler can convert SQL operations, such as >=, into native machine code commands. This saves on the CPU overhead at the cost of an upfront conversion. Generally reserved for very CPU have tasks",
		example: 4,
		requiredExplainMods: ['ANALYZE']
	}
};

const jitOptionFields = {
	Options: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['JIT'],
		description:
			'Container of booleans for enabled JIT features (Inlining, Optimization, Expressions, Deforming).',
		example: {},
		requiredExplainMods: ['ANALYZE']
	},
	Inlining: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options', 'Timing'],
		description:
			'States if the jit_inline_above_cost is enabled. When active and the threshold is met, JIT will reconstruct queries to inline small operations. When it is, JIT will modify.',
		example: true,
		requiredExplainMods: ['ANALYZE']
	},
	Optimization: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options', 'Timing'],
		description:
			'In Options: whether LLVM optimization threshold (jit_optimize_above_cost) is enabled.',
		example: true,
		requiredExplainMods: ['ANALYZE']
	},
	Expressions: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options'],
		description: 'Whether expression jit_expressions setting was enabled.',
		example: true,
		requiredExplainMods: ['ANALYZE']
	},
	Deforming: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options'],
		description: 'Whether tuple-deforming JIT compilation was enabled (jit_tuple_deforming).',
		example: true,
		requiredExplainMods: ['ANALYZE']
	}
};

const jitTimingFields = {
	Timing: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['JIT'],
		description: 'JIT timing breakdown; only emitted with ANALYZE and TIMING both on.',
		example: {},
		requiredExplainMods: ['ANALYZE']
	},
	// GENERATION IS THE PARENT OF DEFORM AND TOTAL
	Generation: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Timing'],
		description: 'Container for code-generation timing (contains Deform and Total).',
		example: {},
		requiredExplainMods: ['ANALYZE']
	},

	Deform: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Generation'],
		description: 'Milliseconds spent generating tuple-deforming code.',
		example: 0.116,
		requiredExplainMods: ['ANALYZE']
	},

	Total: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Generation', 'Timing'],
		description:
			'Total milliseconds for code generation (inside Generation) or for all JIT phases (inside Timing).',
		example: 37.803,
		requiredExplainMods: ['ANALYZE']
	},

	Emission: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Timing'],
		description: 'Milliseconds spent emitting machine code.',
		example: 13.031,
		requiredExplainMods: ['ANALYZE']
	},
	Inlining: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options', 'Timing'],
		description: 'In Timing: milliseconds spent inlining (requires TIMING).',
		example: true,
		requiredExplainMods: ['ANALYZE']
	},
	Optimization: {
		sourceFunction: 'ExplainPrintJIT',
		appliesTo: ['Options', 'Timing'],
		description:
			'In Timing: milliseconds spent optimizing (requires TIMING, which is enabled by default with ANALYZE).',
		example: true,
		requiredExplainMods: ['ANALYZE']
	}
};
