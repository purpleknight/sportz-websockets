import { z } from 'zod'

/* Match status constants */
export const MATCH_STATUS = {
   SCHEDULED: 'scheduled',
   LIVE: 'live',
   FINISHED: 'finished',
};

/* Query schema for listing matches */
export const listMatchesQuerySchema = z.object({
   limit: z.coerce.number().int().positive().max(100).optional(),
});


/** Route param schema for match ID */
export const matchIdParamSchema = z.object({
   id: z.coerce.number().int().positive(),
});

/** Helper for ISO date string validation
 * const isoDateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
   message: 'Invalid ISO date string',
});
 */

const isoDateString = z.iso.datetime();


/* Schema for creating a match */
export const createMatchSchema = z.object({
   sport: z.string().min(1),
   homeTeam: z.string().min(1),
   awayTeam: z.string().min(1),
   startTime: isoDateString,
   endTime: isoDateString,
   homeScore: z.coerce.number().int().nonnegative().optional(),
   awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data, ctx) => {
   const start = new Date(data.startTime);
   const end = new Date(data.endTime);
   if (end <= start) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: 'endTime must be chronologically after startTime',
         path: ['endTime'],
      });
   }
});

/**Schema for upating match score */
export const updateScoreSchema = z.object({
   homeScore: z.coerce.number().int().nonnegative(),
   awayScore: z.coerce.number().int().nonnegative(),
});

