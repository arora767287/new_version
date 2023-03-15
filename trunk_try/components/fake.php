       $data = DB::select("SELECT * FROM question_bank
                        where status=1 and question_bank.id NOT IN (
                        SELECT user_questionbank_answer.questionbank_id FROM user_questionbank_answer WHERE user_id = $user_id and is_interested=1)order by RAND() LIMIT 