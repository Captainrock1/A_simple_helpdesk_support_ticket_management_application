<!--
                                <% if(threads.length === 0) { %>
                            
                            <% } else {
                                for(let i = 0; i < threads.length; i++) { %>
                                    <tr>
                                        <td><%= i+1 %></td>
                                        <td><%= threads[i].thread_owner %></td>
                                        <td><%= threads[i].thread_title %></td>
                                        <td><%= threads[i].thread_content %></td>
                                        <form method="POST" action="/delete_thread/<%= threads[i].thread_id %>">
                                            <td><button type="submit" value="Delete" class="fa-solid fa-trash fa-sm" style="width: 30px; height: 30px; color: red; background-color: white;"></button></td>
                                        </form>
                                    </tr>
                                <% } 
                            } %>
                            -->