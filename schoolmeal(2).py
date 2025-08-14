# --- API 설정 (API Settings) ---
# 본인의 API 키를 여기에 입력하세요. (Enter your API key here.)
# 교육청 API를 사용하려면 open.neis.go.kr에서 발급받아야 합니다.
# (You need to get an API key from open.neis.go.kr to use the education office API.)
API_KEY = "64a289cdabf54d2a9aafc42414cdf058" # << 여기에 발급받은 API 키를 넣어주세요! (Please insert your API key here!)
BASE_URL = "http://open.neis.go.kr/hub/mealServiceDietInfo"

# 서울특별시교육청 코드 (Seoul Metropolitan Office of Education Code)
SEOUL_EDU_CODE = "B10"

# 강서구 초등학교 예시 (Gangseo-gu Elementary School Examples)
# 실제 학교 코드와 이름은 학교정보 API를 통해 얻거나 직접 찾아야 합니다.
# (Actual school codes and names must be obtained through the School Info API or found manually.)
# 여기서는 예시를 위해 몇 개만 포함합니다.
# (Here, only a few are included for example purposes.)
sample_schools = {
    "서울가곡초등학교": "7010499",
    "서울등명초등학교": "7010620",
    "서울화곡초등학교": "7010046",
    "서울공항초등학교": "7010029",
    "서울신정초등학교": "7010043" # 강서구 인접 지역 학교도 포함될 수 있으니, 필요시 정확한 학교 코드로 교체하세요.
}

# --- 함수 정의 (Function Definitions) ---

@st.cache_data(ttl=3600) # 1시간 캐싱 (Cache for 1 hour)
def fetch_school_meal_data(school_code, start_date_str, end_date_str):
    """
    선택된 학교의 급식 데이터를 API에서 가져옵니다.
    (Fetches school meal data from the API for the selected school.)
    """
    params = {
        "KEY": API_KEY,
        "Type": "json",
        "pIndex": 1,
        "pSize": 100,
        "ATPT_OFCDC_SC_CODE": SEOUL_EDU_CODE,
        "SD_SCHUL_CODE": school_code,
        "MLSV_FROM_YMD": start_date_str,
        "MLSV_TO_YMD": end_date_str
    }
    
    # API 키가 설정되지 않았을 경우 오류 메시지 출력 (Display error if API key is not set)
    if API_KEY == "YOUR_API_KEY" or not API_KEY:
        st.error("🚨 API 키를 설정해주세요! `API_KEY` 변수에 본인의 API 키를 입력해야 합니다.")
        return pd.DataFrame()

    try:
        response = requests.get(BASE_URL, params=params, timeout=10) # 10초 타임아웃 (10 second timeout)
        response.raise_for_status() # HTTP 에러 발생 시 예외 발생 (Raise an exception for HTTP errors)
        data = response.json()
        
        # API 응답 구조 확인 및 데이터 추출 (Check API response structure and extract data)
        if "mealServiceDietInfo" in data and len(data["mealServiceDietInfo"]) > 1 and "row" in data["mealServiceDietInfo"][1]:
            meals = []
            for item in data["mealServiceDietInfo"][1]["row"]:
                mlsv_ymd = item.get("MLSV_YMD")
                ddish_nm = item.get("DDISH_NM")
                
                if mlsv_ymd and ddish_nm:
                    # HTML 태그 제거 및 텍스트 정리 (Remove HTML tags and clean text)
                    clean_ddish_nm = ddish_nm.replace("<br/>", "\n").replace(" ", "").strip()
                    # 특정 알레르기 정보 제거 (예: "(1.2.3)")
                    # (Remove specific allergy information (e.g., "(1.2.3)"))
                    clean_ddish_nm = "".join(char for char in clean_ddish_nm if not char.isdigit() and char not in "().")
                    
                    meals.append({
                        "날짜": datetime.strptime(mlsv_ymd, "%Y%m%d").strftime("%Y-%m-%d"), # Date
                        "급식메뉴": clean_ddish_nm # Meal Menu
                    })
            return pd.DataFrame(meals)
        else:
            # API 응답에 급식 데이터가 없는 경우 (No meal data in API response)
            st.info("ℹ️ 해당 기간에 급식 정보가 없습니다.")
            return pd.DataFrame() 
            
    except requests.exceptions.Timeout:
        st.error("API 요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요. ⏳") # API request timed out. Please try again later.
        return pd.DataFrame()
    except requests.exceptions.RequestException as e:
        st.error(f"API 요청 중 오류가 발생했습니다: {e} ⛔") # An error occurred during API request.
        st.info("API 키가 올바른지, 네트워크 연결 상태 또는 API 서버 상태를 확인해주세요.") # Please check if your API key is correct, network connection, or API server status.
        return pd.DataFrame()
    except Exception as e:
        st.error(f"데이터 처리 중 알 수 없는 오류가 발생했습니다: {e} 🐞") # An unknown error occurred while processing data.
        return pd.DataFrame()

# --- Streamlit 앱 시작 (Start Streamlit App) ---
st.set_page_config(layout="wide")

st.title("🏫 강서구 초등학교 급식 비교") # Gangseo-gu Elementary School Meal Comparison
st.markdown("---")

st.write(
    """
    **환영합니다!** ✨ 
    이 앱은 강서구의 초등학교 급식 정보를 날짜별로 비교하여 보여줍니다.
    왼쪽 사이드바에서 학교를 선택하고 조회할 날짜 범위를 지정하면 해당 기간의 급식 메뉴를 확인할 수 있습니다.
    
    **주의:** 이 앱은 교육청 급식 API를 사용합니다. 
    정확한 데이터를 얻으려면 [Open API 서비스 (open.neis.go.kr)](https://open.neis.go.kr/portal/data/service/selectPageList.do?pageUnit=10&pageIndex=1&searchWrd=%EA%B8%89%EC%8B%9D)에서 **자신의 API 키를 발급받아 코드의 `API_KEY` 변수에 입력**해야 합니다.
    제공된 학교 목록은 예시이며, 실제 강서구 내 모든 초등학교를 포함하지 않을 수 있습니다. 
    (더 많은 학교를 추가하려면 해당 학교의 학교 코드를 찾아 `sample_schools` 딕셔너리에 추가해주세요.)
    """
)

# --- 사이드바 (Sidebar) ---
st.sidebar.header("설정 (Settings) ⚙️")

# 학교 선택 (School Selection)
school_names = list(sample_schools.keys())
selected_school_name = st.sidebar.selectbox(
    "학교를 선택하세요 (Select a school):",
    school_names
)
selected_school_code = sample_schools[selected_school_name]

# 날짜 범위 선택 (Date Range Selection)
today = datetime.now().date() # datetime 객체 대신 date 객체 사용 (Use date object instead of datetime object)
default_start_date = today - timedelta(days=7) # 기본값: 일주일 전 (Default: 7 days ago)
default_end_date = today + timedelta(days=7) # 기본값: 일주일 후 (Default: 7 days later)

start_date = st.sidebar.date_input(
    "시작 날짜 (Start Date):", 
    value=default_start_date,
    max_value=today + timedelta(days=365) # 오늘로부터 1년 후까지 선택 가능 (Selectable up to 1 year from today)
)
end_date = st.sidebar.date_input(
    "종료 날짜 (End Date):", 
    value=default_end_date,
    min_value=start_date, # 시작 날짜보다 이전일 수 없음 (Cannot be earlier than start date)
    max_value=today + timedelta(days=365) # 오늘로부터 1년 후까지 선택 가능 (Selectable up to 1 year from today)
)

if start_date > end_date:
    st.sidebar.error("시작 날짜는 종료 날짜보다 빠를 수 없습니다. 📅") # Start date cannot be later than end date.

# --- 메인 영역 (Main Area) ---
st.header(f"✨ {selected_school_name} 급식 메뉴")
st.markdown("---")

if st.button("급식 메뉴 조회 (View Meal Menu) 🔍", type="primary"):
    if start_date and end_date and selected_school_code:
        start_date_str = start_date.strftime("%Y%m%d")
        end_date_str = end_date.strftime("%Y%m%d")

        with st.spinner("급식 정보를 불러오는 중입니다... 🍽️"):
            meal_df = fetch_school_meal_data(selected_school_code, start_date_str, end_date_str)

        if not meal_df.empty:
            st.dataframe(meal_df, use_container_width=True, hide_index=True)
            st.success("급식 정보를 성공적으로 불러왔습니다! ✅")
        # fetch_school_meal_data 함수 내에서 정보 없음 또는 오류 메시지를 처리하므로 별도 else 필요 없음
        # (No separate else needed here, as 'no info' or 'error' messages are handled within fetch_school_meal_data)
    else:
        st.error("학교와 날짜를 모두 선택해주세요. ⚠️") # Please select both school and date.

st.markdown("---")
st.caption("제공: 교육청 급식 정보 Open API (Provided by: Education Office Meal Information Open API)")
st.caption("개발자: Gemini (Developer: Gemini)")
