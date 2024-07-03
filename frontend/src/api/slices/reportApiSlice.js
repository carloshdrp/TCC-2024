import { apiSlice } from "../apiSlice";

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/reports?${params}`;
      },
    }),
    getReportsByUserId: builder.query({
      query: (userId) => {
        return `/reports/user/${userId}`;
      },
    }),
    createReport: builder.mutation({
      query: (report) => ({
        url: "/reports",
        method: "POST",
        body: report,
      }),
    }),
    updateReportStatus: builder.mutation({
      query: ({ reportId, status, message }) => ({
        url: `/reports/${reportId}`,
        method: "PATCH",
        body: { status, message },
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportsByUserIdQuery,
  useCreateReportMutation,
  useUpdateReportStatusMutation,
} = reportApiSlice;
