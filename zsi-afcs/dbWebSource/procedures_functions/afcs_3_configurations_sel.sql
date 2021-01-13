

CREATE PROCEDURE [dbo].[afcs_3_configurations_sel]  
(  
   @user_id INT = NULL
  ,@vehicle_type_id INT
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	; WITH cte_fare_matrix (
		base_fare
		, base_kms
		, succeeding_km_fare
	) AS (
		SELECT
			TOP 1
			base_fare
			, base_kms
			, succeeding_km_fare
		FROM dbo.fare_matrix
		WHERE fare_id=@vehicle_type_id
	)
	, cte_student (
		student_discount
	) AS (
		SELECT
			discount_pct
		FROM dbo.discount_ref WHERE 1 = 1
		AND discount_code = 'SD'
	)
	, cte_senior (
		senior_discount
	) AS (
		SELECT
			discount_pct
		FROM dbo.discount_ref WHERE 1 = 1
		AND discount_code = 'SC'
	)
	, cte_pwd (
		pwd_discount
	) AS (
		SELECT
			discount_pct
		FROM dbo.discount_ref WHERE 1 = 1
		AND discount_code = 'PWD'
	)
	SELECT
		a.base_fare
		, a.base_kms
		, a.succeeding_km_fare
		, b.student_discount
		, c.senior_discount
		, d.pwd_discount
	FROM cte_fare_matrix a
	CROSS JOIN cte_student b
	CROSS JOIN cte_senior c
	CROSS JOIN cte_pwd d
END;
